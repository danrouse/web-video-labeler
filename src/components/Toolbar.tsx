import * as React from 'react';
import './Toolbar.css';

interface Props {
  isLabeling: boolean;
  isSeeking: boolean;
  canClear: boolean;
  canStepBackward: boolean;

  startLabeling: () => void;
  stopLabeling: () => void;
  clearLabels: () => void;
  stepBackward: () => void;
  stepForward: () => void;
  next: () => void;
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
          <button onClick={props.next} disabled={props.isSeeking} title="Next">
            <i className="fas fa-check" />
            <span>Next</span>
          </button>
        </div>
      }
      <div>
        <button onClick={props.toggleLabelClassPanel} title="Classes">
          <i className="fas fa-tags" />
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
