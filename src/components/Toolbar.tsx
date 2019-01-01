import * as React from 'react';
import './Toolbar.css';

interface Props {
  numLabeledImages: number;
  numLabelClasses: number;
  isLabeling: boolean;
  isSeeking: boolean;
  isLocalStorageFull: boolean;

  startLabeling: () => void;
  stopLabeling: () => void;
  clearLabels: () => void;
  prev: () => void;
  skip: () => void;
  next: () => void;
  downloadLabeledImages: () => void;
  clearLabeledImages: () => void;
  toggleSettingsPanel: () => void;
  toggleHelpPanel: () => void;
  toggleLabelClassPanel: () => void;
}

export default function Toolbar(props: Props) {
  return (
    <div className="__app_toolbar">
      {!props.isLabeling ?
        <div style={{ flex: 1, maxWidth: '50%' }}>
          <button onClick={props.startLabeling} title="Begin Annotating Labels">
            <i className="fas fa-power-off" />
            <span>Label</span>
          </button>
        </div>
        :
        <div style={{ flex: 1, maxWidth: '50%' }}>
          <button className="icon" onClick={props.stopLabeling} title="Stop">
            <i className="fas fa-stop" />
          </button>
          <button className="icon" onClick={props.clearLabels} title="Clear Labels">
            <i className="fas fa-eraser" />
          </button>
          <button className="icon" onClick={props.prev} disabled={props.isSeeking} title="Skip Back">
            <i className="fas fa-step-backward" />
          </button>
          <button className="icon" onClick={props.skip} disabled={props.isSeeking} title="Skip Ahead">
            <i className="fas fa-step-forward" />
          </button>
          <button onClick={props.next} disabled={props.isSeeking} title="Continue">
            <i className="fas fa-check" />
            <span>Continue</span>
          </button>
        </div>
      }
      {props.isLocalStorageFull &&
        <p>local storage full</p>
      }
      {props.numLabeledImages > 0 &&
        <div style={{ margin: '0 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button onClick={props.downloadLabeledImages} title="Download Data">
            <i className="fas fa-save" />
            <span>{props.numLabeledImages}</span>
          </button>
          <button className="icon" onClick={props.clearLabeledImages} title="Clear Saved Data">
            <i className="fas fa-trash" />
          </button>
        </div>
      }
      <button onClick={props.toggleLabelClassPanel} title="Classes">
        <i className="fas fa-tags" />
        <span>{props.numLabelClasses}</span>
      </button>
      <button className="icon" onClick={props.toggleHelpPanel} title="Help">
        <i className="fas fa-question" />
      </button>
      <button className="icon" onClick={props.toggleSettingsPanel} title="Settings">
        <i className="fas fa-cog" />
      </button>
    </div>
  );
}
