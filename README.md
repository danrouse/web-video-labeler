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
  - To change the label name, click on the name and select or enter a new class
- When the frame is fully labeled, click <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/check.svg" width="18" height="18" /> **CONTINUE** to save the labels, download the image, and skip the video forward.
- Once you are done, download the labels by clicking the <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/save.svg" width="18" height="18" /> download button.
- Extract the archive use the accompanying scripts to use the data:
  - `move_downloaded_images.sh` relocates downloaded images to the annotations data dir
  - `train.sh` calls the training binary (will move downloaded images if not already)


### Controls

- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18"  /> Start/stop labeling
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/eraser.svg" width="18" height="18" /> Erase labels currently drawn on frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/undo.svg" width="18" height="18" /> Undo saving last frame
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-backward.svg" width="18" height="18" /> Step backward
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-forward.svg" width="18" height="18" /> Step forward
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/save.svg" width="18" height="18" /> Download label annotations and scripts to use for training
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/trash.svg" width="18" height="18" /> Erase label annotation data
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/tags.svg" width="18" height="18" /> Open class manager, to remove or import lists of label classes
- <img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/cog.svg" width="18" height="18" /> Open settings menu


### Other features

#### Combining multiple exports
Exports include a script, `combine_projects.sh`, which can be used to combine multiple sets of annotations. The first argument is the export directory to merge into, followed by any number of other exports (with or without extracting the ZIP file.)
```sh
$ ./combine_projects.sh . ../data2.zip ../data3-extracted
```


## Known issues

- video quality changing can mess with scale / label position
