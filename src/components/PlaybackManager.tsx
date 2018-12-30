import * as React from 'react';
// import KeyBindProvider from './KeyBindProvider';

type ButtonHandler = () => void;
interface Props {
  isLabeling?: boolean;
  onStart: ButtonHandler;
  onStop: ButtonHandler;
  onNext: ButtonHandler;
  onPrev: ButtonHandler;
  onSkip: ButtonHandler;
  onClear: ButtonHandler;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'paper-button': React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    }
  }
}

export default function PlaybackManager(props: Props) {
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: '100%',
    right: 0,
    borderRadius: '0 0 3px 3px',
    border: '1px solid lightgray',
    borderTop: 'none',
    margin: '2px 0',
    backgroundColor: 'white',
    padding: 6
  };
  const buttonStyle: React.CSSProperties = {
    border: '1px solid lightgray',
    backgroundColor: 'lightgray',
    borderRadius: 2,
    margin: 2,
    padding: 4,
  };
  if (props.isLabeling) {
    return (
      <div style={containerStyle}>
        <paper-button style={buttonStyle} onClick={props.onNext}>
          Continue
        </paper-button>
        <paper-button style={buttonStyle} onClick={props.onPrev}>
          ⏪
        </paper-button>
        <paper-button style={buttonStyle} onClick={props.onSkip}>
          ⏩
        </paper-button>
        <paper-button style={buttonStyle} onClick={props.onClear}>
          Clear
        </paper-button>
        <paper-button style={buttonStyle} onClick={props.onStop}>
          stop
        </paper-button>
      </div>
    );
  }
  return (
    <div style={containerStyle}>
      <paper-button style={buttonStyle} onClick={props.onStart}>
        Label
      </paper-button>
    </div>
  );
}
