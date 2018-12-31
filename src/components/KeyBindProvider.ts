import * as React from 'react';

interface Props {
  keybinds: {
    [key: string]: (...args: any[]) => any;
  };
}

export default class KeyBindProvider extends React.Component<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyPress, true);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress, true);
  }

  handleKeyPress = (evt: KeyboardEvent) => {
    const nodeName = (evt.target as Element).nodeName;
    if (nodeName === 'INPUT' || nodeName === 'SELECT' || nodeName === 'TEXTAREA') return;
    if (this.props.keybinds.hasOwnProperty(evt.key)) {
      evt.preventDefault();
      this.props.keybinds[evt.key]();
    }
  }

  render() {
    return null;
  }
}
