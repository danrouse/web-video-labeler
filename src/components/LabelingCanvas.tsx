import * as React from 'react';
import LabelingCanvasLabel from './LabelingCanvasLabel';

type LabelsChangeHandler = (labels: Label[], callback?: () => void) => void;

interface Props {
  scale: number;
  gridSize: number;
  labels: Label[];
  onLabelsChange: LabelsChangeHandler;
  classes: string[];
  previousLabelName: string;
}

interface State {
  initializeLabelMouseEvent?: React.MouseEvent;
}

export default class LabelingCanvas extends React.Component<Props, State> {
  static defaultProps = {
    gridSize: 16,
    previousLabelName: 'new label',
  };
  state: State = {};

  ref: HTMLElement | null = null;

  getOffsets() {
    if (!this.ref) return { offsetX: 0, offsetY: 0 };
    const { x: offsetX, y: offsetY } = this.ref.getBoundingClientRect() as DOMRect;
    return { offsetX, offsetY };
  }

  startDrawing = (evt: React.MouseEvent) => {
    if (evt.button !== 0 || evt.target !== evt.currentTarget) return;

    // create a 0x0 rect at mouse and start resizing
    const { offsetX, offsetY } = this.getOffsets();
    const newLabel: Label = {
      name: this.props.previousLabelName,
      rect: {
        x: (evt.clientX - offsetX) / this.props.scale,
        y: (evt.clientY - offsetY) / this.props.scale,
        width: 0,
        height: 0,
      },
    };
    this.props.onLabelsChange(
      this.props.labels.concat([newLabel]),
      // send the event to child after parent creates it, to initialize drawing
      () => this.setState({ initializeLabelMouseEvent: evt }),
    );

    evt.persist();
    evt.preventDefault();
    evt.stopPropagation();
  }

  handleLabelChange = (index: number, label?: Label) => {
    const { labels, onLabelsChange } = this.props;
    let nextLabels;
    if (label) {
      nextLabels = [
        ...labels.slice(0, index),
        label,
        ...labels.slice((index || 0) + 1),
      ];
    } else {
      nextLabels = labels.filter((_, i) => i !== index);
    }
    onLabelsChange(nextLabels);
  }

  render() {
    const { gridSize, scale, labels } = this.props;
    return (
      <div
        onMouseDown={this.startDrawing}
        style={{
          backgroundSize: `${gridSize * scale}px ${gridSize * scale}px`,
          backgroundPosition: `${gridSize * -0.5 * scale}px ${gridSize * -0.5 * scale}px`,
          backgroundImage: `
            linear-gradient(to right, rgba(85,85,85,0.2) 1px, rgba(170,170,170,0.2) 2px, transparent 2px),
            linear-gradient(to bottom, rgba(85,85,85,0.2) 1px, rgba(170,170,170,0.2) 2px, transparent 2px)
          `,
          position: 'absolute',
          pointerEvents: 'all',
          top: 0, bottom: 0, left: 0, right: 0,
          width: '100%',
          height: '100%',
          cursor: 'crosshair',
        }}
        ref={ref => this.ref = ref}
      >
        {labels.map((label, index) => (
          <LabelingCanvasLabel
            index={index}
            label={label}
            scale={scale}
            classes={this.props.classes}
            onChange={this.handleLabelChange}
            initializeWithMouseEvent={index === labels.length - 1 ? this.state.initializeLabelMouseEvent : undefined}
          />
        ))}
      </div>
    );
  }
}
