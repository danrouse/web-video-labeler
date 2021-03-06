import * as React from 'react';
import * as ReactDOM from 'react-dom';
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

  componentWillMount() {
    if (!document.getElementById('WebVideoLabeler-ModalDialogContext')) {
      const elem = document.createElement('div');
      elem.id = 'WebVideoLabeler-ModalDialogContext';
      document.body.appendChild(elem);
    }
    window.addEventListener('keydown', this.handleKeypress);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeypress);
  }

  handleKeypress = (evt: KeyboardEvent) => {
    const target = evt.target as Element;
    const restrictedTargets = ['INPUT', 'TEXTAREA', 'SELECT'];
    const isValidTarget = !target || restrictedTargets.indexOf(target.nodeName) === -1;
    if (evt.key === 'Escape' && isValidTarget) this.props.onClose();
  }

  render() {
    return ReactDOM.createPortal(
      <div className={`WebVideoLabeler ModalDialog ${this.props.className || ''}`} onClick={this.close}>
        <div className="ModalDialog__inner">
          <div className="ModalDialog__title">
            <button onClick={this.props.onClose} title="Close" className="icon">
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
      </div>,
      document.getElementById('WebVideoLabeler-ModalDialogContext') as HTMLElement,
    );
  }
}
