import * as React from 'react';
import LabelClassSelector from './LabelClassSelector';
import LabelBox from './LabelBox';
import stringToColor from '../util/stringToColor';
import { Anchors, getAnchors, anchorsToCursor, moveRect, resizeRect } from '../util/rect';
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

  cleanup?: (evt?: MouseEvent) => void;

  componentWillReceiveProps({ initializeWithMouseEvent }: Props) {
    if (initializeWithMouseEvent && initializeWithMouseEvent !== this.props.initializeWithMouseEvent) {
      this.startResizing(initializeWithMouseEvent);
    }
  }

  componentWillUnmount() {
    if (this.cleanup) this.cleanup();
  }

  removeLabel = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.onChange(this.props.index);
  }

  updateLabelClass = (name: string) => {
    this.props.onChange(this.props.index, { ...this.props.label, name });
    this.setState({ isInputExpanded: false });
  }

  setResizeCursor = (evt: React.MouseEvent) =>
    this.setState({ resizeCursor: anchorsToCursor(getAnchors(this.ref, evt.clientX, evt.clientY)) })

  beginMoveOrResize = (evt: React.MouseEvent, mousemoveHandler: (evt: MouseEvent) => void) => {
    if (!this.ref || !(this.ref.parentElement instanceof HTMLElement)) return;
    const { x, y, width, height } = this.ref.parentElement.getBoundingClientRect() as DOMRect;
    this.setState({
      mouseDownX: evt.clientX,
      mouseDownY: evt.clientY,
      isActive: true,
      containerRect: { x, y, width, height },
      anchors: getAnchors(this.ref, evt.clientX, evt.clientY),
    });
    this.cleanup = (evt?: MouseEvent) => {
      window.removeEventListener('mousemove', mousemoveHandler);
      if (this.cleanup) window.removeEventListener('mouseup', this.cleanup);
      if (!evt) return;
      if (this.state.workingRect) {
        // wait until mouseup before propagating changes to parent
        this.props.onChange(this.props.index, { ...this.props.label, rect: this.state.workingRect });
      }
      this.setState({ isActive: false, workingRect: undefined });
    };
    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', this.cleanup);
    evt.preventDefault();
    evt.stopPropagation();
  }

  move = (evt: MouseEvent) => {
    const { mouseDownX, mouseDownY, containerRect } = this.state;
    if (!containerRect) return;
    this.setState({
      workingRect: moveRect(
        this.props.label.rect,
        evt.clientX - mouseDownX,
        evt.clientY - mouseDownY,
        this.props.scale,
        containerRect,
      ),
    });
  }

  resize = (evt: MouseEvent) => {
    const { anchors, containerRect } = this.state;
    if (!containerRect) return;
    this.setState({
      workingRect: resizeRect(
        this.props.label.rect,
        evt.clientX - containerRect.x,
        evt.clientY - containerRect.y,
        this.props.scale,
        containerRect,
        anchors,
      ),
    });
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
    const { scale, label: { rect: rectFromProps, name } } = this.props;
    const rect = rectFromState || rectFromProps;
    const color = stringToColor(name);
    return (
      <LabelBox
        className={`LabelingCanvasLabel ${isActive ? 'LabelingCanvasLabel--isActive' : ''}`}
        style={{
          transform: `translateX(${rect.x * scale}px) translateY(${rect.y * scale}px)`,
          width: rect.width * scale,
          height: rect.height * scale,
        }}
        label={name}
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
            classes={this.props.classes.filter(c => c !== name)}
            onClick={this.updateLabelClass}
            onAddClass={this.updateLabelClass}
          />
        }
      </LabelBox>
    );
  }
}
