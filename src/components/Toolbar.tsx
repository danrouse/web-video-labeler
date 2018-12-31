import * as React from 'react';
import './Toolbar.css';

interface Props {
  numLabels: number;
  numLabeledImages: number;
  numLabelClasses: number;
  isLabeling: boolean;
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
          <button onClick={props.startLabeling}>
            <i className="fas fa-power-off" title="Begin Annotating Labels" />
            <span>Label</span>
          </button>
        </div>
        :
        <div style={{ flex: 1, maxWidth: '50%' }}>
          <button className="icon" onClick={props.stopLabeling}>
            <i className="fas fa-stop" title="Stop" />
          </button>
          <button className="icon" onClick={props.clearLabels}>
            <i className="fas fa-eraser" title="Clear Labels" />
          </button>
          <button className="icon" onClick={props.prev}>
            <i className="fas fa-step-backward" title="Skip Back" />
          </button>
          <button className="icon" onClick={props.skip}>
            <i className="fas fa-step-forward" title="Skip Ahead" />
          </button>
          <button onClick={props.next}>
            <i className="fas fa-check" title="Continue" />
            <span>Continue</span>
          </button>
        </div>
      }
      {props.isLocalStorageFull &&
        <p>local storage full</p>
      }
      {props.numLabeledImages > 0 &&
        <div style={{ margin: '0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>
            {props.numLabeledImages > 0 &&
              <span>
                {props.numLabeledImages} image{props.numLabeledImages === 1 ? '' : 's'}
              </span>
            }
            {props.numLabels > 0 &&
              <span>
                , {props.numLabels} label{props.numLabels === 1 ? '' : 's'}
              </span>
            }
          </p>
          <button className="icon" onClick={props.downloadLabeledImages}>
            <i className="fas fa-save" title="Download" />
          </button>
          <button className="icon" onClick={props.clearLabeledImages}>
            <i className="fas fa-trash" title="Clear Saved Data" />
          </button>
        </div>
      }
      <button onClick={props.toggleLabelClassPanel}>
        <i className="fas fa-tags" title="Classes" />
        <span>{props.numLabelClasses}</span>
      </button>
      <button className="icon" onClick={props.toggleHelpPanel}>
        <i className="fas fa-question" title="Help" />
      </button>
      <button className="icon" onClick={props.toggleSettingsPanel}>
        <i className="fas fa-cog" title="Settings" />
      </button>
    </div>
  );
}
