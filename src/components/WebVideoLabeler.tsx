import * as React from 'react';
import VideoOverlay from './VideoOverlay';
import LabelingCanvas from './LabelingCanvas';
import LocalStorageSync from './LocalStorageSync';
import Toolbar from './Toolbar';
import SettingsPanel from './SettingsPanel';
import HelpPanel from './HelpPanel';
import LabelClassPanel from './LabelClassPanel';
import { downloadVideoFrame, downloadZIPFile } from '../util/download';
import { getVideoID, toggleYouTubeUI } from '../util/youtube';
import { labeledImagesToDarknet } from '../formats/darknet';
import './WebVideoLabeler.css';

interface State {
  labels: Label[];
  labeledImages: LabeledImage[];
  labelClasses: string[];
  isLabeling: boolean;
  isSettingsPanelVisible: boolean;
  isHelpPanelVisible: boolean;
  isLabelClassPanelVisible: boolean;
  settings: UserSettings;

  isSeeking: boolean;
  isLocalStorageFull: boolean;
  wasPlayingBeforeLabeling: boolean;
  videoScale: number;
}

const defaultState: State = {
  labels: [],
  labeledImages: [],
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
    darknetWidth: 416,
    darknetHeight: 416,
    darknetExecutablePath: 'darknet',
    darknetConfigURL: 'https://raw.githubusercontent.com/AlexeyAB/darknet/master/cfg/yolov3-tiny_obj.cfg',
    darknetTrainTestRatio: 0.8,
  },

  isSeeking: false,
  isLocalStorageFull: false,
  wasPlayingBeforeLabeling: false,
  videoScale: 1,
};

export default class App extends React.Component<{ video: HTMLVideoElement }, State> {
  state = defaultState;

  componentWillMount() {
    this.props.video.addEventListener('play', () => this.setState({ isLabeling: false }));
    this.props.video.addEventListener('seeking', () => this.setState({ isSeeking: true }));
    this.props.video.addEventListener('seeked', () => this.setState({ isSeeking: false }));
  }

  clearLabeledImages = () => confirm('are you sure? will delete all cached images + labels') &&
    this.setState({ labeledImages: [] })
  resetSettings = () => confirm('are you sure you want to reset all settings?') &&
    this.setState({ settings: defaultState.settings })
  clearLabels = () => this.setState({ labels: [] });
  clearLabelClasses = () => this.setState({ labelClasses: [] });

  handleLoadState = (state: State) => this.setState(state);
  handleStorageFull = () => this.setState({ isLocalStorageFull: true });
  handleVideoScaleChange = (videoScale: number) => this.setState({ videoScale });
  handleLabelsChange = (labels: Label[], callback?: () => void) => {
    const labelClasses = new Set(this.state.labelClasses);
    labels.forEach(({ str }) => str !== 'new label' && labelClasses.add(str));
    this.setState({ labels, labelClasses: Array.from(labelClasses) }, callback);
  }
  handleSettingChange = (settings: Partial<UserSettings>) => this.setState({
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
      const labeledImage = this.downloadFrame();
      this.setState({ labeledImages: this.state.labeledImages.concat([labeledImage]) });
    }
    this.skip();
  }
  undo = () => {
    const { time } = this.state.labeledImages[this.state.labeledImages.length - 1];
    this.props.video.currentTime = time;
    this.setState({ labeledImages: this.state.labeledImages.slice(0, -1) });
  }

  downloadFrame = (): LabeledImage => {
    const time = this.props.video.currentTime;
    const frame = Math.floor(time * this.state.settings.skipLengthFrameRate);
    const scale = this.state.settings.savedImageScale;
    const filename = `_annotate_${getVideoID()}_${frame}.jpg`;
    downloadVideoFrame(this.props.video, filename, undefined, scale);
    if (this.state.settings.saveCroppedImages) {
      const labelCounts: { [str: string]: number } = {};
      this.state.labels.forEach((label) => {
        if (!labelCounts[label.str]) labelCounts[label.str] = 0;
        labelCounts[label.str] += 1;
        const croppedFilename = `_annotate_${getVideoID()}_${frame}_${label.str}-${labelCounts[label.str]}.jpg`;
        downloadVideoFrame(this.props.video, croppedFilename, label.rect);
      });
    }
    return {
      filename,
      frame,
      time,
      labels: this.state.labels.map(label => ({
        ...label,
        rect: {
          width: label.rect.width * scale,
          height: label.rect.height * scale,
          x: label.rect.x * scale,
          y: label.rect.y * scale,
        },
      })),
      url: window.location.href,
      width: this.props.video.videoWidth,
      height: this.props.video.videoHeight,
    };
  }

  downloadLabeledImages = async () => {
    const data = await labeledImagesToDarknet(
      this.state.labeledImages,
      this.state.labelClasses,
      {
        configURL: this.state.settings.darknetConfigURL,
        executablePath: this.state.settings.darknetExecutablePath,
        width: this.state.settings.darknetWidth,
        height: this.state.settings.darknetHeight,
        trainTestRatio: this.state.settings.darknetTrainTestRatio,
      },
    );
    await downloadZIPFile(data, 'data.zip');
  }

  render() {
    return (
      <div className="WebVideoLabeler">
        <LocalStorageSync
          data={this.state}
          exclude={['isLabeling']}
          localStorageKey="WebVideoLabeler"
          onLoad={this.handleLoadState}
          onStorageFull={this.handleStorageFull}
        />
        <Toolbar
          numLabeledImages={this.state.labeledImages.length}
          numLabelClasses={this.state.labelClasses.length}
          isLabeling={this.state.isLabeling}
          isSeeking={this.state.isSeeking}
          isLocalStorageFull={this.state.isLocalStorageFull}
          canUndo={
            this.state.labeledImages.length > 0 &&
            this.state.labeledImages[this.state.labeledImages.length - 1].url === window.location.href
          }
          canClear={this.state.labels.length > 0}
          canStepBackward={this.props.video.currentTime !== 0}

          startLabeling={this.startLabeling}
          stopLabeling={this.stopLabeling}
          clearLabels={this.clearLabels}
          stepBackward={this.prev}
          stepForward={this.skip}
          next={this.next}
          undo={this.undo}
          downloadLabeledImages={this.downloadLabeledImages}
          clearLabeledImages={this.clearLabeledImages}
          toggleSettingsPanel={this.toggleSettingsPanel}
          toggleHelpPanel={this.toggleHelpPanel}
          toggleLabelClassPanel={this.toggleLabelClassPanel}
        />
        {this.state.isSettingsPanelVisible &&
          <SettingsPanel
            settings={this.state.settings}
            onChange={this.handleSettingChange}
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
              onLabelsChange={this.handleLabelsChange}
              previousLabelName={
                this.state.labels.length > 0
                  ? this.state.labels[this.state.labels.length - 1].str
                  : this.state.labelClasses[this.state.labelClasses.length - 1]
              }
            />
          }
        </VideoOverlay>
      </div>
    );
  }
}
