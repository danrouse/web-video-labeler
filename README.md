Label videos on the web for training image classifiers. Web Video Labeler is a browser extension to step through videos and generate label annotations in formats ready for training.

TODO: GIF screencast of app in use


## Compatibility
- Browsers: **Chrome** or **Firefox**
- Output: **Darknet (YOLO)**


## Installation

To use the compiled extension, download the CRX from the [Releases page](#TODO) and drag-and-drop it onto your browser.

To use the extension from source,
1. `npm install && npm run build`
2. Load the unpacked extension _(
  Instructions for:
  [Chrome](https://developer.chrome.com/extensions/getstarted),
  [Firefox](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Temporary_Installation_in_Firefox)
)_


## Usage

- Visit a web page with a video on it, such as on YouTube. A toolbar should appear at the bottom of your screen to manage the labeling process.
- Click <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18" valign="middle" /> **LABEL** to begin labeling the video.
- Draw labels on top of the video using the mouse:
  - Labels can be moved and resized
  - To change the label name, click on the name and select or enter a new class
- When the frame is fully labeled, click <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/check.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /> **CONTINUE** to save the labels, download the image, and skip the video forward.
- Once you are done, download the labels by clicking the <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/save.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /> download button.
- Extract the archive use the accompanying scripts to use the data:
  - `move_downloaded_images.sh` relocates downloaded images to the annotations data dir
  - `train.sh` calls the training binary (will move downloaded images if not already)


### Controls

- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18" valign="middle" />Start/stop labeling
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/eraser.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Erase labels currently drawn on frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/undo.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Undo saving last frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-backward.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Step backward (change number of frames in settings)
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-forward.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Step forward
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/save.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /> Download label annotations and scripts to use for training
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/trash.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /> Erases label annotation data (can't delete the actual images, since those are already downloaded)


### Other features

- label class manager to import ordered lists of classes
- combining multiple projects using provided script


## Known issues

- video quality changing can mess with scale / label position
