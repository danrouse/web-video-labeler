import * as React from 'react';
import LabelClassSelector from './LabelClassSelector';
import LabelBox from './LabelBox';
import LabelDetailsPanel from './modals/LabelDetailsPanel';
import stringToColor from '../util/stringToColor';
import { Anchors, getAnchors, anchorsToCursor, moveRect, resizeRect } from '../util/rect';
import './LabelingCanvasLabel.css';

type LabelChangeHandler = (index: number, label?: Label) => void;
type LabelCloneHandler = (label: Label) => void;

interface Props {
  index: number;
  label: Label;
  scale: number;
  classes: string[];
  onChange: LabelChangeHandler;
  onClone: LabelCloneHandler;
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

  isClassSelectorVisible?: boolean;
  isDetailsPanelVisible?: boolean;
  isShiftKeyDown?: boolean;
}

export default class LabelingCanvasLabel extends React.Component<Props, State> {
  ref?: HTMLElement;

  state: State = {
    resizeCursor: '',
    mouseDownX: 0,
    mouseDownY: 0,
    anchors: { left: false, right: false, top: false, bottom: false },
  };

  handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') this.setState({ isShiftKeyDown: true });
  }
  handleKeyUp = (evt: KeyboardEvent) => {
    if (evt.key === 'Shift') this.setState({ isShiftKeyDown: false });
  }
  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  componentWillReceiveProps({ initializeWithMouseEvent }: Props) {
    if (initializeWithMouseEvent && initializeWithMouseEvent !== this.props.initializeWithMouseEvent) {
      this.startResizing(initializeWithMouseEvent);
    }
  }

  removeLabel = (evt: React.MouseEvent) => {
    evt.preventDefault();
    evt.stopPropagation();
    this.props.onChange(this.props.index);
  }

  cloneLabel = () => {
    if (!this.ref || !(this.ref.parentElement instanceof HTMLElement)) return;
    const clonedLabel: Label = {
      ...this.props.label,
      rect: moveRect(
        this.props.label.rect,
        6 / this.props.scale,
        6 / this.props.scale,
        this.ref.parentElement.getBoundingClientRect().width,
        this.ref.parentElement.getBoundingClientRect().height,
      ),
    };
    this.props.onClone(clonedLabel);
  }

  updateLabelClass = (name: string) => {
    this.props.onChange(this.props.index, { ...this.props.label, name });
    this.setState({ isClassSelectorVisible: false });
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
    const cleanup = () => {
      window.removeEventListener('mousemove', mousemoveHandler);
      window.removeEventListener('mouseup', cleanup);
      if (this.state.workingRect) {
        this.props.onChange(this.props.index, { ...this.props.label, rect: this.state.workingRect });
      }
    };
    window.addEventListener('mousemove', mousemoveHandler);
    window.addEventListener('mouseup', cleanup);
    evt.preventDefault();
    evt.stopPropagation();
  }

  move = (evt: MouseEvent) => {
    const { mouseDownX, mouseDownY, containerRect } = this.state;
    if (!containerRect) return;
    let x2 = evt.clientX - mouseDownX;
    let y2 = evt.clientY - mouseDownY;
    if (this.state.isShiftKeyDown) {
      if (Math.abs(x2) > Math.abs(y2)) {
        y2 = 0;
      } else {
        x2 = 0;
      }
    }
    this.setState({
      workingRect: moveRect(
        this.props.label.rect,
        x2 / this.props.scale,
        y2 / this.props.scale,
        containerRect.width / this.props.scale,
        containerRect.height / this.props.scale,
      ),
    });
  }

  resize = (evt: MouseEvent) => {
    const { anchors, containerRect } = this.state;
    if (!containerRect) return;
    this.setState({
      workingRect: resizeRect(
        this.props.label.rect,
        (evt.clientX - containerRect.x) / this.props.scale,
        (evt.clientY - containerRect.y) / this.props.scale,
        containerRect.width / this.props.scale,
        containerRect.height / this.props.scale,
        anchors,
        this.state.isShiftKeyDown,
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

  toggleLabelClassSelector = () => this.setState({ isClassSelectorVisible: !this.state.isClassSelectorVisible });
  toggleDetailsPanel = () => this.setState({ isDetailsPanelVisible: !this.state.isDetailsPanelVisible });

  handleChange = (label: Label) => this.props.onChange(this.props.index, label);

  render() {
    const { workingRect: rectFromState, isActive } = this.state;
    const { scale, label: { rect: rectFromProps, name } } = this.props;
    const rect = rectFromState || rectFromProps;
    const color = stringToColor(name);
    const labelClassSelector = (
      <LabelClassSelector
        className="LabelingCanvasLabel__LabelClassSelector"
        style={{ borderColor: color, backgroundColor: color }}
        classes={this.props.classes.filter(c => c !== name)}
        onClick={this.updateLabelClass}
        onAddClass={this.updateLabelClass}
      />
    );
    return (
      <LabelBox
        className={`LabelingCanvasLabel ${isActive ? 'LabelingCanvasLabel--isActive' : ''}`}
        style={{
          transform: `translateX(${rect.x * scale}px) translateY(${rect.y * scale}px)`,
          width: rect.width * scale,
          height: rect.height * scale,
          borderStyle: rectFromState ? 'dashed' : 'solid',
        }}
        label={name}
        getRef={ref => ref && (this.ref = ref)}
        onContextMenu={this.removeLabel}
        onLabelClick={this.toggleLabelClassSelector}
        buttons={[
          <button key="details" onClick={this.toggleDetailsPanel} title="Edit Details">
            <i className="fas fa-pencil-alt" />
          </button>,
          <button key="clone" onClick={this.cloneLabel} title="Clone">
            <i className="fas fa-clone" />
          </button>,
          <button key="erase" onClick={this.removeLabel} title="Erase">
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
        {this.state.isClassSelectorVisible && labelClassSelector}
        {this.state.isDetailsPanelVisible &&
          <LabelDetailsPanel
            label={this.props.label}
            onClose={this.toggleDetailsPanel}
            onChange={this.handleChange}
            labelClassSelector={labelClassSelector}
            video={document.querySelector('video')}
          />
        }
      </LabelBox>
    );
  }
}
