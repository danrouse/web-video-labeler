Web Video Labeler is a browser extension to step through videos and generate label annotations in formats ready for training.


![preview](preview.gif)


## Compatibility
- Browsers: **Chrome** or **Firefox**
- Output: **Darknet (YOLO)**


## Installation

Download the latest package (`.crx` for Chrome, `.xpi` for Firefox) from the [Releases page](https://github.com/danrouse/web-video-labeler/releases)  and run in your browser (this should happen automatically after downloading, or you can drag-and-drop the archive onto your browser.)

### From source
1. `npm install && npm run build`
2. Load the unpacked extension
  (_[Chrome instructions](https://developer.chrome.com/extensions/getstarted),
  [Firefox instructions](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Temporary_Installation_in_Firefox)_)


## Usage

- Visit a web page with a video on it, such as on YouTube. A toolbar should appear at the bottom of your screen to manage the labeling process.
- Click <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18"  /> **LABEL** to begin labeling the video.
- Draw labels on top of the video using the mouse:
  - Labels can be moved and resized
  - Delete a label by right-clicking on it
  - To change the label name, click on the name and select or enter a new class
- When the frame is fully labeled, click <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/check.svg" width="18" height="18" /> **NEXT** to download the image and labels, and to skip the video forward.
- _Darknet output_: after all of the data is saved, run the downloaded script `prepare_darknet_training_data.py` to prepare the dataset with class IDs.

### Controls

- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18"  /> Start/stop labeling
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/eraser.svg" width="18" height="18" /> Erase labels currently drawn on frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/undo.svg" width="18" height="18" /> Undo saving last frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-backward.svg" width="18" height="18" /> Step backward
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-forward.svg" width="18" height="18" /> Step forward
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/tags.svg" width="18" height="18" /> Open class manager, to remove or import lists of label classes
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/cog.svg" width="18" height="18" /> Open settings menu
