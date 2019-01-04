import * as React from 'react';
import stringToColor from '../util/stringToColor';
import './LabelClassSelector.css';

interface Props {
  className?: string;
  classes: string[];
  onClick?: (name: string) => void;
  onRightClick?: (name: string) => void;
  onAddClass?: (name: string) => void;
  style?: React.CSSProperties;
}

export default class LabelClassSelector extends React.Component<Props> {
  handleClick = (evt: React.FormEvent<HTMLButtonElement>) =>
    this.props.onClick && this.props.onClick(evt.currentTarget.name)

  handleSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    this.props.onAddClass && this.props.onAddClass((evt.currentTarget[0] as HTMLInputElement).value);
  }

  handleContextMenu = (evt: React.MouseEvent) => {
    evt.preventDefault();
    this.props.onRightClick && this.props.onRightClick((evt.currentTarget as HTMLButtonElement).name);
  }

  render() {
    return (
      <div className={`LabelClassSelector ${this.props.className || ''}`} style={this.props.style}>
        {this.props.classes.map(labelClass => (
          <button
            name={labelClass}
            onClick={this.handleClick}
            onContextMenu={this.handleContextMenu}
            style={{ backgroundColor: stringToColor(labelClass) }}
          >
            {labelClass}
          </button>
        ))}
        <form onSubmit={this.handleSubmit}>
          <input type="text" placeholder="new class" />
          <button type="submit"><i className="fas fa-plus" /></button>
        </form>
      </div>
    );
  }
}
