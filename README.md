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

- Visit video page
- Click&nbsp;<div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/power-off.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Label</div> to begin labeling the video
- Draw labels on top of the video
  - Labels can be moved and resized
  - Click the label name to change

  - <div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/eraser.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /></div>Erase labels currently drawn on frame
  - <div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/undo.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /></div>Undo saving last frame
  - <div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-backward.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /></div>Step backward (change number of frames in settings)
  - <div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/step-forward.svg" width="18" height="18" valign="middle" style="margin-right: 4px" /></div>Step forward
  - <div style="border: 1px outset gray; padding: 2px 4px; background-color: #ccc; border-radius: 2px; vertical-align: middle; margin: 0 4px; color: #333; font-weight: bold; text-transform: uppercase; display: inline-block"><img src="https://rawcdn.githack.com/FortAwesome/Font-Awesome/fc377a13a36717464b61c045444fea1e35c26b6d/svgs/solid/check.svg" width="18" height="18" valign="middle" style="margin-right: 4px" />Continue</div>save image, labels, and skip fwd

- Downloading
  - download button
  - trash - erases label data (can't touch the already-downloaded images)

- Using
  - darknet - run train script
  - combining multiple projects


## Known issues
- video quality changing can mess with scale / label position
