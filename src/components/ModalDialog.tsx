import * as React from 'react';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
}

export default class ModalDialog extends React.Component<Props> {
  close = (evt: React.MouseEvent) => evt.currentTarget === evt.target && this.props.onClose();

  render() {
    return (
      <div className="__app_ui_panel" onClick={this.close}>
        <style type="text/css">
        {`
          .__app_ui_panel {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1109;
          }
            .__app_ui_panel > div {
              background-color: white;
              border-radius: 3px;
              box-shadow: 2px 2px 6px rgba(0,0,0,0.25);
              padding: 12px;
              min-width: 50%;
            }
        `}
        </style>
        <div>
          <button onClick={this.props.onClose} className="icon" style={{ float: 'right' }}>
            <i className="fas fa-times" title="Close" />
          </button>
          {this.props.children}
        </div>
      </div>
    );
  }
}
