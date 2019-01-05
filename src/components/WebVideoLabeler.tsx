import * as React from 'react';
import VideoOverlay from './VideoOverlay';
import LabelingCanvas from './LabelingCanvas';
import LocalStorageSync from './LocalStorageSync';
import Toolbar from './Toolbar';
import SettingsPanel from './SettingsPanel';
import HelpPanel from './HelpPanel';
import LabelClassPanel from './LabelClassPanel';
import videoFrameToDataURL from '../util/videoFrameToDataURL';
import { getVideoID, toggleYouTubeUI } from '../util/youtube';
import { scaleRect } from '../util/rect';
import { getAbsoluteDownloadPath, download } from '../extension/messaging';
import { labeledImageToDarknet } from '../output/darknet';
import { labeledImageToPascalVOCXML } from '../output/pascal-voc-xml';
import './WebVideoLabeler.css';

interface State {
  labels: Label[];
  labelClasses: string[];
  isLabeling: boolean;
  isSettingsPanelVisible: boolean;
  isHelpPanelVisible: boolean;
  isLabelClassPanelVisible: boolean;
  settings: UserSettings;

  isSeeking: boolean;
  wasPlayingBeforeLabeling: boolean;
  videoScale: number;
  videoScaleWidth: number;
}

const defaultState: State = {
  labels: [],
  labelClasses: [],
  isLabeling: false,
  isSettingsPanelVisible: false,
  isHelpPanelVisible: false,
  isLabelClassPanelVisible: false,
  settings: {
    skipLength: 10,
    skipLengthFrameRate: 24,
    saveCroppedImages: false,
    saveImagesWithoutLabels: false,
    savedImageScale: 1,
    saveDarknet: true,
    savePascalVOCXML: true,
    saveJSON: false,
    gridSize: 16,
    projectName: 'data',
  },

  isSeeking: false,
  wasPlayingBeforeLabeling: false,
  videoScale: 0,
  videoScaleWidth: 0,
};

export default class App extends React.Component<{ video: HTMLVideoElement }, State> {
  state = defaultState;

  componentWillMount() {
    this.props.video.addEventListener('play', () => this.setState({ isLabeling: false }));
    this.props.video.addEventListener('seeking', () => this.setState({ isSeeking: true }));
    this.props.video.addEventListener('seeked', () => this.setState({ isSeeking: false }));
  }

  resetSettings = () => confirm('are you sure you want to reset all settings?') &&
    this.setState({ settings: defaultState.settings })
  clearLabels = () => this.setState({ labels: [] });
  clearLabelClasses = () => this.setState({ labelClasses: [] });

  handleLoadState = (state: State) => this.setState(state);
  handleVideoScaleChange = (videoScale: number) => {
    if (!videoScale || !isFinite(videoScale)) return;
    const videoScaleWidth = this.props.video.videoWidth;
    let labels = this.state.labels;
    if (this.state.videoScale && videoScaleWidth !== this.state.videoScaleWidth) {
      const rescale = this.state.videoScale / videoScale;
      labels = labels.map(label => ({
        ...label,
        rect: scaleRect(label.rect, rescale),
      }));
    }
    this.setState({ labels, videoScale, videoScaleWidth });
  }
  handleLabelsChange = (labels: Label[], callback?: () => void) => {
    const labelClasses = new Set(this.state.labelClasses);
    labels.forEach(({ name }) => name !== 'unknown' && labelClasses.add(name));
    this.setState({ labels, labelClasses: Array.from(labelClasses) }, callback);
  }
  handleSettingsChange = (settings: Partial<UserSettings>) => this.setState({
    settings: {
      ...this.state.settings,
      ...settings,
    },
  })
  handleLabelClassChange = (labelClasses: string[]) => this.setState({ labelClasses });
  toggleSettingsPanel = () => this.setState({ isSettingsPanelVisible: !this.state.isSettingsPanelVisible });
  toggleHelpPanel = () => this.setState({ isHelpPanelVisible: !this.state.isHelpPanelVisible });
  toggleLabelClassPanel = () => this.setState({ isLabelClassPanelVisible: !this.state.isLabelClassPanelVisible });

  startLabeling = () => {
    const wasPlayingBeforeLabeling = !this.props.video.paused;
    this.props.video.pause();
    toggleYouTubeUI(false);
    this.setState({ wasPlayingBeforeLabeling, isLabeling: true });
  }
  stopLabeling = () => {
    if (this.state.wasPlayingBeforeLabeling) {
      this.props.video.play();
    }
    this.setState({ isLabeling: false }, () => toggleYouTubeUI(true));
  }
  seek = (dt: number) => this.props.video.currentTime += dt;
  skip = () => this.seek(this.state.settings.skipLength / this.state.settings.skipLengthFrameRate);
  prev = () => this.seek(-this.state.settings.skipLength / this.state.settings.skipLengthFrameRate);
  next = () => {
    if (this.state.settings.saveImagesWithoutLabels || this.state.labels.length > 0) {
      this.downloadFrame();
    }
    this.skip();
  }

  downloadFrame = async () => {
    const time = this.props.video.currentTime;
    const frame = Math.floor(time * this.state.settings.skipLengthFrameRate);
    const scale = this.state.settings.savedImageScale;
    const filenameBase = `${this.state.settings.projectName}/${getVideoID()}_${frame}`;
    const filename = `${filenameBase}.jpg`;

    const labeledImage = {
      filename,
      frame,
      time,
      labels: this.state.labels.map(label => ({
        ...label,
        rect: scaleRect(label.rect, scale),
      })),
      url: window.location.href,
      width: this.props.video.videoWidth,
      height: this.props.video.videoHeight,
    };

    download(videoFrameToDataURL(this.props.video, undefined, scale), filename);

    if (this.state.settings.saveCroppedImages) {
      const labelCounts: { [name: string]: number } = {};
      this.state.labels.forEach((label) => {
        if (!labelCounts[label.name]) labelCounts[label.name] = 0;
        labelCounts[label.name] += 1;
        const croppedFilename = `${filenameBase}_${label.name}-${labelCounts[label.name]}.jpg`;
        download(videoFrameToDataURL(this.props.video, label.rect), croppedFilename);
      });
    }

    if (this.state.settings.saveDarknet) {
      const data = labeledImageToDarknet(labeledImage);
      download(`data:text/plain;,${data.data}`, data.path);

      const prepareScriptFilename = 'prepare_darknet_training_data.py';
      if (!await getAbsoluteDownloadPath(prepareScriptFilename)) {
        download(chrome.extension.getURL(prepareScriptFilename), prepareScriptFilename);
      }
    }

    if (this.state.settings.savePascalVOCXML) {
      const data = await labeledImageToPascalVOCXML(labeledImage);
      download(`data:text/plain;,${data.data}`, data.path);
    }

    if (this.state.settings.saveJSON) {
      const data = JSON.stringify(labeledImage, null, 2);
      download(`data:text/plain;,${data}`, filename.replace(/\.jpg$/, '.json'));
    }
  }

  render() {
    return (
      <div className="WebVideoLabeler">
        <LocalStorageSync
          data={this.state}
          exclude={['isLabeling']}
          localStorageKey="WebVideoLabeler"
          onLoad={this.handleLoadState}
        />
        <Toolbar
          isLabeling={this.state.isLabeling}
          isSeeking={this.state.isSeeking}
          canClear={this.state.labels.length > 0}
          canStepBackward={this.props.video.currentTime !== 0}

          startLabeling={this.startLabeling}
          stopLabeling={this.stopLabeling}
          clearLabels={this.clearLabels}
          stepBackward={this.prev}
          stepForward={this.skip}
          next={this.next}
          toggleSettingsPanel={this.toggleSettingsPanel}
          toggleHelpPanel={this.toggleHelpPanel}
          toggleLabelClassPanel={this.toggleLabelClassPanel}
        />
        {this.state.isSettingsPanelVisible &&
          <SettingsPanel
            settings={this.state.settings}
            onChange={this.handleSettingsChange}
            onClose={this.toggleSettingsPanel}
            onReset={this.resetSettings}
          />
        }
        {this.state.isHelpPanelVisible &&
          <HelpPanel onClose={this.toggleHelpPanel} />
        }
        {this.state.isLabelClassPanelVisible &&
          <LabelClassPanel
            labelClasses={this.state.labelClasses}
            onClose={this.toggleLabelClassPanel}
            onChange={this.handleLabelClassChange}
          />
        }
        <VideoOverlay elem={this.props.video} onScaleChange={this.handleVideoScaleChange}>
          {this.state.isLabeling &&
            <LabelingCanvas
              labels={this.state.labels}
              classes={this.state.labelClasses}
              scale={this.state.videoScale}
              gridSize={this.state.settings.gridSize}
              previousLabelName={
                this.state.labels.length > 0
                  ? this.state.labels[this.state.labels.length - 1].name
                  : this.state.labelClasses[this.state.labelClasses.length - 1]
              }
              onLabelsChange={this.handleLabelsChange}
            />
          }
        </VideoOverlay>
      </div>
    );
  }
}
