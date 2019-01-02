import * as React from 'react';
import './ModalDialog.css';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  title: React.ReactChild;
  className?: string;
  buttons?: JSX.Element[];
}

export default class ModalDialog extends React.Component<Props> {
  close = (evt: React.MouseEvent) => evt.currentTarget === evt.target && this.props.onClose();

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeypress);
  }

  handleKeypress = (evt: KeyboardEvent) => {
    const target = evt.target as Element;
    const restrictedTargets = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'FORM'];
    const isValidTarget = !target || restrictedTargets.indexOf(target.nodeName) === -1;
    if (evt.key === 'Escape' && isValidTarget) this.props.onClose();
  }

  render() {
    return (
      <div className={`ModalDialog ${this.props.className || ''}`} onClick={this.close}>
        <div className="ModalDialog__inner">
          <div className="ModalDialog__title">
            <button onClick={this.props.onClose} title="Close" className="icon" style={{ float: 'right' }}>
              <i className="fas fa-times" />
            </button>
            {this.props.title}
          </div>
          <div className="ModalDialog__children">
            {this.props.children}
          </div>
          {this.props.buttons &&
            <div className="ModalDialog__buttons">
              {this.props.buttons}
            </div>
          }
        </div>
      </div>
    );
  }
}
