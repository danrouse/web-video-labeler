import * as React from 'react';
import './UploadArea.css';

function getDropItemContents(item: DataTransferItem) {
  return new Promise<string | undefined>((resolve) => {
    const file = item.getAsFile();
    if (!file) resolve();
    const fd = new FileReader();
    fd.onload = (evt: any) => resolve(evt.target.result);
  });
}

interface Props {
  onUpload: (data: string) => boolean | void;
}

interface State {
  isDragging: boolean;
}

export default class UploadArea extends React.Component<Props, State> {
  state: State = {
    isDragging: false,
  };

  handleDragEnter: React.DragEventHandler = () => {
    this.setState({ isDragging: true });
  }

  handleDragLeave: React.DragEventHandler = () => {
    this.setState({ isDragging: false });
  }

  handleDragOver: React.DragEventHandler = (evt) => {
    evt.preventDefault();
  }

  handleDrop: React.DragEventHandler = (evt) => {
    Promise.all(Array.from(evt.dataTransfer.items).map(getDropItemContents))
      .then(files => files.filter(f => f).forEach(f => this.props.onUpload(f as string)));
    evt.persist();
    evt.preventDefault();
  }

  render() {
    return (
      <div
        className="UploadArea"
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        style={{ backgroundColor: this.state.isDragging ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        {this.props.children}
      </div>
    );
  }
}
