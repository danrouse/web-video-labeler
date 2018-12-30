import * as React from 'react';
import VideoOverlay from './VideoOverlay';
import LabelingCanvas from './LabelingCanvas';
import LocalStorageSync from './LocalStorageSync';
import DownloadManager from './DownloadManager';
import PlaybackManager from './PlaybackManager';
import { videoFrameToDataURL, downloadFiles, imageDataURLToBlob } from '../util/dataURL';
import { getVideoID, getYouTubeVideoElem, toggleYouTubeUI } from '../util/youtube';

interface State {
  labels: Label[];
  labeledImages: LabeledImage[];
  isLabeling: boolean;
  wasPlayingBeforeLabeling: boolean;
  videoScale: number;
  skipLength: number;
  isLocalStorageFull?: boolean;
  saveFullImages: boolean;
  saveCroppedImages: boolean;
}

const defaultState: State = {
  labels: [],
  labeledImages: [],
  isLabeling: true,
  wasPlayingBeforeLabeling: false,
  videoScale: 1,
  skipLength: 0.5,
  saveFullImages: true,
  saveCroppedImages: false,
};

export default class App extends React.Component<{}, State> {
  state = defaultState;

  static CSS = `
  .__app_ui {
    position: fixed;
    z-index: 1101;
    bottom: 0;
    left: 0;
    padding: 1em;
    margin: 1em;
    font-size: 16px;
    border-radius: 2px;
    background-color: rgba(255,255,255,0.8);
    box-shadow: 0 0 2px rgba(0,0,0,0.3);
    text-shadow: 1px 1px 0 rgba(0,0,0,0.2);
  }
  `;

  componentWillMount() {
    getYouTubeVideoElem().addEventListener('play', () => {
      if (this.state.isLabeling) {
        this.setState({
          isLabeling: false
        });
      }
    });
  }

  // Local storage
  handleStateLoaded = (state: State) => {
    // don't load isLabeling state
    this.setState({
      ...state,
      isLabeling: false
    });
  };
  handleStorageFull = () => this.setState({ isLocalStorageFull: true });

  // Downloading
  toggleSaveFullImages = (evt: React.FormEvent<HTMLInputElement>) =>
    this.setState({ saveFullImages: evt.currentTarget.checked });
  toggleSaveCroppedImages = (evt: React.FormEvent<HTMLInputElement>) =>
    this.setState({ saveCroppedImages: evt.currentTarget.checked });
  downloadLabeledImages = async () => {
    const files = [];
    const labelCounts: { [str: string]: number } = {};
    for (let labeledImage of this.state.labeledImages) {
      if (this.state.saveFullImages) {
        files.push({
          path: `data/${labeledImage.filename}.jpg`,
          data: await imageDataURLToBlob(labeledImage.imageDataURL)
        });
      }
      if (this.state.saveCroppedImages) {
        for (let label of labeledImage.labels) {
          if (!labelCounts[label.str]) labelCounts[label.str] = 0;
          files.push({
            path: `data/${label.str}-${labelCounts[label.str]++}.jpg`,
            data: await imageDataURLToBlob(labeledImage.imageDataURL, label.rect),
          });
        }
      }
      // TODO: Add the actual labels
    }
    await downloadFiles(files, `data.zip`);
  };
  clearLabeledImages = () => {
    if (confirm('are you sure? will delete all cached images + labels')) {
      this.setState({ labeledImages: [] });
      return true;
    }
  };

  // Video manager
  handleVideoScaleChange = (videoScale: number) => this.setState({ videoScale });

  // Playback manager
  startLabeling = () => {
    const wasPlayingBeforeLabeling = !getYouTubeVideoElem().paused;
    getYouTubeVideoElem().pause();
    toggleYouTubeUI(false);
    this.setState({ isLabeling: true, wasPlayingBeforeLabeling });
  };
  stopLabeling = () => {
    if (this.state.wasPlayingBeforeLabeling) {
      getYouTubeVideoElem().play();
    }
    this.setState({ isLabeling: false }, () => toggleYouTubeUI(true));
  };
  skip = () => getYouTubeVideoElem().currentTime += this.state.skipLength;
  prev = () => getYouTubeVideoElem().currentTime -= -this.state.skipLength;
  next = () => {
    const labeledImage: LabeledImage = {
      imageDataURL: videoFrameToDataURL(getYouTubeVideoElem()),
      labels: this.state.labels,
      filename: `_annotate_${getVideoID()}_${Math.round(getYouTubeVideoElem().currentTime * 100)}`,
    };
    this.setState({
      labeledImages: this.state.labeledImages.concat([labeledImage])
    });
    this.skip();
  };
  clearLabels = () => this.setState({ labels: [] });

  // Labeler
  handleLabelsChange = (labels: Label[], callback?: () => void) => this.setState({ labels }, callback);

  render() {
    return (
      <div>
        <LocalStorageSync
          data={this.state}
          localStorageKey="__chrome-youtube-labeler-data"
          onLoad={this.handleStateLoaded}
          onStorageFull={this.handleStorageFull}
        />
        <style type="text/css">{App.CSS}</style>
        <div className="__app_ui">
          {this.state.labeledImages.length > 0 &&
            <DownloadManager
              isLocalStorageFull={this.state.isLocalStorageFull}
              numLabeledImages={this.state.labeledImages.length}
              saveFullImages={this.state.saveFullImages}
              saveCroppedImages={this.state.saveCroppedImages}
              onSaveFullImagesChange={this.toggleSaveFullImages}
              onSaveCroppedImagesChange={this.toggleSaveCroppedImages}
              onDownloadDataClick={this.downloadLabeledImages}
              onEraseDataClick={this.clearLabeledImages}
            />
          }
        </div>
        <VideoOverlay elem={getYouTubeVideoElem()} onScaleChange={this.handleVideoScaleChange}>
          <PlaybackManager
            isLabeling={this.state.isLabeling}
            onStart={this.startLabeling}
            onStop={this.stopLabeling}
            onSkip={this.skip}
            onNext={this.next}
            onPrev={this.prev}
            onClear={this.clearLabels}
          />
          {this.state.isLabeling &&
            <LabelingCanvas
              gridSize={24}
              labels={this.state.labels}
              scale={this.state.videoScale}
              onLabelsChange={this.handleLabelsChange}
            />
          }
        </VideoOverlay>
      </div>
    );
  }
}
