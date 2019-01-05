import * as React from 'react';
import ModalDialog from './ModalDialog';
import LabelBox from './LabelBox';

interface Props {
  onClose: () => void;
}

export default function HelpPanel({ onClose }: Props) {
  return (
    <ModalDialog title="Help" onClose={onClose}>
      <LabelBox label="Usage">
        <ul style={{ paddingLeft: 24, margin: 0, lineHeight: '24px' }}>
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
            When the frame is fully labeled, click <button><i className="fas fa-check" /> Next</button>
            to download the image and labels, and to skip the video forward.
          </li>
          <li>
            <em>Darknet output</em>: after all of the data is saved, run the downloaded script
            <code>prepare_darknet_training_data.py</code> to prepare the dataset with class IDs.
          </li>
        </ul>
      </LabelBox>
      <LabelBox label="Controls">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li><button><i className="fas fa-power-off" /></button> Start/stop labeling</li>
          <li><button><i className="fas fa-eraser" /></button> Erase labels currently drawn on frame</li>
          <li><button><i className="fas fa-undo" /></button> Undo saving last frame</li>
          <li><button><i className="fas fa-step-backward" /></button> Step backward</li>
          <li><button><i className="fas fa-step-forward" /></button> Step forward</li>
          <li><button><i className="fas fa-cog" /></button> Open settings menu</li>
        </ul>
      </LabelBox>
      <LabelBox label="About">
        <p>
          Web Video Labeler is an open source browser extension written by&nbsp;
          <a href="https://github.com/danrouse" target="_blank">danrouse</a>.
          Source code is available on&nbsp;
          <a href="" target="_blank">
            <button>
              <i className="fab fa-github" /> GitHub <i className="fas fa-external-link-alt" style={{ fontSize: 10 }} />
            </button>
          </a>
        </p>
      </LabelBox>
    </ModalDialog>
  );
}
