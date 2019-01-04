import * as React from 'react';
import LabelClassSelector from './LabelClassSelector';
import LabelBox from './LabelBox';
import stringToColor from '../util/stringToColor';
import './LabelingCanvasLabel.css';

type LabelChangeHandler = (index: number, label?: Label) => void;

interface Props {
  index: number;
  label: Label;
  scale: number;
  classes: string[];
  onChange: LabelChangeHandler;
  initializeWithMouseEvent?: React.MouseEvent;
}

interface Anchors {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

interface State {
  resizeCursor: string;
  workingRect?: Rect;
  containerRect?: Rect;
  mouseDownX: number;
  mouseDownY: number;
  isActive?: boolean;
  anchors: Anchors;

  isInputExpanded?: boolean;
}

export default class LabelingCanvasLabel extends React.Component<Props, State> {
  ref?: HTMLElement;

  state: State = {
    resizeCursor: '',
    mouseDownX: 0,
    mouseDownY: 0,
    anchors: { left: false, right: false, top: false, bottom: false },
  };

  componentWillReceiveProps({ initializeWithMouseEvent }: Props) {
    if (initializeWithMouseEvent && initializeWithMouseEvent !== this.props.initializeWithMouseEvent) {
      this.startResizing(initializeWithMouseEvent);
    }
  }

  scale = (n: number) => n / this.props.scale;

  removeLabel = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.onChange(this.props.index);
  }

  updateLabelClass = (str: string) => {
    this.props.onChange(this.props.index, { ...this.props.label, str });
    this.setState({ isInputExpanded: false });
  }

  getAnchors(evt: React.MouseEvent) {
    if (!this.ref) return { left: false, right: false, top: false, bottom: false };
    const { x, y, width, height } = this.ref.getBoundingClientRect() as DOMRect;
    const left = Math.abs(evt.clientX - x) < 12;
    const right = Math.abs(evt.clientX - x - width) < 12;
    const top = Math.abs(evt.clientY - y) < 12;
    const bottom = Math.abs(evt.clientY - y - height) < 12;
    return { left, right, top, bottom };
  }

  setResizeCursor = (evt: React.MouseEvent) => {
    const anchors = this.getAnchors(evt);
    let cursor = '';
    if (anchors.top) cursor += 'n';
    if (anchors.bottom) cursor += 's';
    if (anchors.left) cursor += 'w';
    if (anchors.right) cursor += 'e';
    if (cursor) cursor += '-resize';
    this.setState({ resizeCursor: cursor });
  }

  beginMoveOrResize = (evt: React.MouseEvent, mousemoveHandler: (evt: MouseEvent) => void) => {
    if (!this.ref || !(this.ref.parentElement instanceof HTMLElement)) return;
    const { x, y, width, height } = this.ref.parentElement.getBoundingClientRect() as DOMRect;
    this.setState({
      mouseDownX: evt.clientX,
      mouseDownY: evt.clientY,
      isActive: true,
      containerRect: { x, y, width, height },
      anchors: this.getAnchors(evt),
    });
    const cleanup = () => {
      window.removeEventListener('mousemove', mousemoveHandler);
      window.removeEventListener('mouseup', cleanup);
      if (this.state.workingRect) {
        // wait until mouseup before propagating changes to parent
        this.props.onChange(this.props.index, { ...this.props.label, rect: this.state.workingRect });
      }
      this.setState({ isActive: false, workingRect: undefined });
    };
    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', cleanup);
    evt.preventDefault();
    evt.stopPropagation();
  }

  move = (evt: MouseEvent) => {
    const { mouseDownX, mouseDownY, containerRect } = this.state;
    if (!containerRect) return;
    let { x, y, width, height } = this.props.label.rect; // tslint:disable-line prefer-const
    x += this.scale(evt.clientX - mouseDownX);
    y += this.scale(evt.clientY - mouseDownY);
    // constrain to container (all sides)
    x = Math.max(Math.min(x, this.scale(containerRect.width) - width), 0);
    y = Math.max(Math.min(y, this.scale(containerRect.height) - height), 0);
    this.setState({ workingRect: { x, y, width, height } });
  }

  resize = (evt: MouseEvent) => {
    const { anchors, containerRect } = this.state;
    if (!containerRect) return;
    let { x, y, width, height } = this.props.label.rect;
    // constrain to container (top left)
    const x2 = Math.max(this.scale(evt.clientX - containerRect.x), 0);
    const y2 = Math.max(this.scale(evt.clientY - containerRect.y), 0);
    // apply based on where the resize is anchored
    if (anchors.left) {
      width += x - x2;
      x = x2;
    } else if (anchors.right) {
      width = x2 - x;
    }
    if (anchors.top) {
      height += y - y2;
      y = y2;
    } else if (anchors.bottom) {
      height = y2 - y;
    }
    // invert coords when moving past the origin
    if (width < 0) {
      x += width;
      width *= -1;
    }
    if (height < 0) {
      y += height;
      height *= -1;
    }
    // constrain to container (bottom right)
    width = Math.min(width, this.scale(containerRect.width) - x);
    height = Math.min(height, this.scale(containerRect.height) - y);

    this.setState({ workingRect: { x, y, width, height } });
  }

  startMoving = (evt: React.MouseEvent) => {
    if (evt.button !== 0) return;
    this.beginMoveOrResize(evt, this.move);
  }

  startResizing = (evt: React.MouseEvent) => {
    if (evt.button !== 0) return;
    this.beginMoveOrResize(evt, this.resize);
  }

  toggleLabelClassSelector = () => this.setState({ isInputExpanded: !this.state.isInputExpanded });

  render() {
    const { workingRect: rectFromState, isActive } = this.state;
    const { scale, label: { rect: rectFromProps, str } } = this.props;
    const rect = rectFromState || rectFromProps;
    const color = stringToColor(str);
    return (
      <LabelBox
        className={`LabelingCanvasLabel ${isActive ? 'LabelingCanvasLabel--isActive' : ''}`}
        style={{
          transform: `translateX(${rect.x * scale}px) translateY(${rect.y * scale}px)`,
          width: rect.width * scale,
          height: rect.height * scale,
        }}
        label={str}
        getRef={ref => ref && (this.ref = ref)}
        onContextMenu={this.removeLabel}
        onLabelClick={this.toggleLabelClassSelector}
        buttons={[
          <button onClick={this.toggleLabelClassSelector}>
            <i className="fas fa-pencil-alt" />
          </button>,
          <button onClick={this.removeLabel}>
            <i className="fas fa-times" />
          </button>,
        ]}
      >
        <div
          className="LabelingCanvasLabel__resizeArea"
          style={{ cursor: this.state.resizeCursor }}
          onMouseMove={this.setResizeCursor}
          onMouseDown={this.startResizing}
        />
        <div
          className="LabelingCanvasLabel__moveArea"
          onMouseDown={this.startMoving}
        />
        {this.state.isInputExpanded &&
          <LabelClassSelector
            className="LabelingCanvasLabel__LabelClassSelector"
            style={{ borderColor: color, backgroundColor: color }}
            classes={this.props.classes.filter(c => c !== str)}
            onClick={this.updateLabelClass}
            onAddClass={this.updateLabelClass}
          />
        }
      </LabelBox>
    );
  }
}
