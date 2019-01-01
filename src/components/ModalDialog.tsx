import * as React from 'react';
import './ModalDialog.css';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default class ModalDialog extends React.Component<Props> {
  close = (evt: React.MouseEvent) => evt.currentTarget === evt.target && this.props.onClose();

  render() {
    return (
      <div className={`ModalDialog ${this.props.className || ''}`} onClick={this.close}>
        <div>
          <button onClick={this.props.onClose} title="Close" className="icon" style={{ float: 'right' }}>
            <i className="fas fa-times" />
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }
}
