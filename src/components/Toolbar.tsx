import * as React from 'react';
import './Toolbar.css';

interface Props {
  numLabeledImages: number;
  numLabelClasses: number;
  isLabeling: boolean;
  isSeeking: boolean;
  isLocalStorageFull: boolean;
  canUndo: boolean;
  canClear: boolean;
  canStepBackward: boolean;

  startLabeling: () => void;
  stopLabeling: () => void;
  clearLabels: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  next: () => void;
  undo: () => void;
  downloadLabeledImages: () => void;
  clearLabeledImages: () => void;
  toggleSettingsPanel: () => void;
  toggleHelpPanel: () => void;
  toggleLabelClassPanel: () => void;
}

export default function Toolbar(props: Props) {
  return (
    <div className="Toolbar">
      {!props.isLabeling ?
        <div className="Toolbar__main-controls">
          <button onClick={props.startLabeling} title="Begin Annotating Labels">
            <i className="fas fa-power-off" />
            <span>Label</span>
          </button>
        </div>
        :
        <div className="Toolbar__main-controls">
          <button className="icon" onClick={props.stopLabeling} title="Stop">
            <i className="fas fa-power-off" />
          </button>
          <button className="icon" onClick={props.clearLabels} disabled={!props.canClear} title="Clear Labels">
            <i className="fas fa-eraser" />
          </button>
          <button className="icon" onClick={props.undo} disabled={!props.canUndo} title="Undo Last Image">
            <i className="fas fa-undo" />
          </button>
          <button
            className="icon"
            onClick={props.stepBackward}
            disabled={props.isSeeking || !props.canStepBackward}
            title="Skip Back"
          >
            <i className="fas fa-step-backward" />
          </button>
          <button className="icon" onClick={props.stepForward} disabled={props.isSeeking} title="Skip Ahead">
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
      <div className="Toolbar__download-controls">
        <button
          onClick={props.downloadLabeledImages}
          title="Download Data"
          disabled={props.numLabeledImages === 0}
        >
          <i className="fas fa-download" />
          <span>{props.numLabeledImages}</span>
        </button>
        <button
          className="icon"
          onClick={props.clearLabeledImages}
          title="Clear Saved Data"
          disabled={props.numLabeledImages === 0}
        >
          <i className="fas fa-trash" />
        </button>
      </div>
      <div>
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
    </div>
  );
}
