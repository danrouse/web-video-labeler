import * as React from 'react';
import ModalDialog from './ModalDialog';

interface Props {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: Props) {
  return (
    <ModalDialog onClose={onClose}>
      <h1>Help</h1>

      <h2>Usage</h2>
      <ul>
        <li>
          Visit a web page with a video on it, such as on YouTube.
          A toolbar should appear at the bottom of your screen to manage the labeling process.
        </li>
        <li>
          Click <button><i className="fas fa-power-off" /> Label</button> to
          begin labeling the video.
        </li>
        <li>
          Draw labels on top of the video using the mouse:
          <ul>
            <li>Labels can be moved and resized</li>
            <li>Delete a label by right-clicking on it</li>
            <li>To change the label name, click on the name and select or enter a new class</li>
          </ul>
        </li>
        <li>
          When the frame is fully labeled, click <button><i className="fas fa-check" /> Continue</button>
          to save the labels, download the image, and skip the video forward.
        </li>
        <li>
          Once you are done, download the labels by clicking the
          <button><i className="fas fa-save" /></button> download button.
        </li>
        <li>
          Extract the archive use the accompanying scripts to use the data:
          <ul>
            <li>`move_downloaded_images.sh` relocates downloaded images to the annotations data dir</li>
            <li>`train.sh` calls the training binary (will move downloaded images if not already)</li>
          </ul>
        </li>
      </ul>

      <h2>Controls</h2>

      <ul style={{ listStyle: 'none' }}>
        <li><button><i className="fas fa-power-off" /></button> Start/stop labeling</li>
        <li><button><i className="fas fa-eraser" /></button> Erase labels currently drawn on frame</li>
        <li><button><i className="fas fa-undo" /></button> Undo saving last frame</li>
        <li><button><i className="fas fa-step-backward" /></button> Step backward</li>
        <li><button><i className="fas fa-step-forward" /></button> Step forward</li>
        <li>
          <button><i className="fas fa-save" /></button> Download
          label annotations and scripts to use for training
        </li>
        <li><button><i className="fas fa-trash" /></button> Erase label annotation data</li>
        <li>
          <button><i className="fas fa-tags" /></button> Open
          class manager, to remove or import lists of label classes
        </li>
        <li><button><i className="fas fa-cog" /></button> Open settings menu</li>
      </ul>

      <h2>Combining multiple exports</h2>
      <p>
        Exports include a script, `combine_projects.sh`, which can be used to combine
        multiple sets of annotations. The first argument is the export directory to
        merge into, followed by any number of other exports (with or without
        extracting the ZIP file.)
      </p>
      <pre>
        $ ./combine_projects.sh . ../data2.zip ../data3-extracted
      </pre>

      <h2>About</h2>
      <p>
        Web Video Labeler is an open source browser extension written by&nbsp;
        <a href="https://github.com/danrouse" target="_blank">danrouse</a>.
        Source code is available on&nbsp;
        <a href="" target="_blank">
          <button>
            <i className="fab fa-github" /> GitHub <i className="fas fa-external-link-alt" style={{ fontSize: 10 }} />
          </button>
        </a>.
      </p>
    </ModalDialog>
  );
}
