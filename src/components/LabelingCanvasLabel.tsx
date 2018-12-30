import * as React from 'react';
import AutocompleteInput from './AutocompleteInput';
import hashStringToColor from '../util/hashStringToColor';

type LabelChangeHandler = (index: number, label?: Label) => void;

interface Props {
  index: number;
  label: Label;
  scale: number;
  autocompleteSuggestions?: string[];
  onChange: LabelChangeHandler;
  initializeWithMouseEvent?: React.MouseEvent;
}

interface Anchors {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
};

interface State {
  resizeCursor: string;
  workingRect?: Rect;
  containerRect?: Rect;
  mouseDownX: number;
  mouseDownY: number;
  isActive?: boolean;
  isHovered?: boolean;
  anchors: Anchors;
};

export default class LabelingCanvasLabel extends React.Component<Props, State> {
  ref?: HTMLElement;

  state: State = {
    resizeCursor: '',
    mouseDownX: 0,
    mouseDownY: 0,
    anchors: { left: false, right: false, top: false, bottom: false }
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
  };

  handleLabelStrChange = (evt: React.SyntheticEvent<HTMLElement>, str = (evt.currentTarget as HTMLInputElement).value) => {
    this.props.onChange(this.props.index, { ...this.props.label, str });
  };

  cancelEvent = (evt: React.SyntheticEvent) => {
    evt.stopPropagation();
  };

  getAnchors(evt: React.MouseEvent) {
    if (!this.ref) return { left: false, right: false, top: false, bottom: false };
    const { x, y, width, height } = this.ref.getBoundingClientRect() as DOMRect;
    const left = Math.abs(evt.clientX - x) < 8;
    const right = Math.abs(evt.clientX - x - width) < 8;
    const top = Math.abs(evt.clientY - y) < 8;
    const bottom = Math.abs(evt.clientY - y - height) < 8;
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
  };

  beginMoveOrResize = (evt: React.MouseEvent, mousemoveHandler: (evt: MouseEvent) => void) => {
    if (!this.ref || !(this.ref.parentElement instanceof HTMLElement)) return;
    const { x, y, width, height } = this.ref.parentElement.getBoundingClientRect() as DOMRect;
    this.setState({
      mouseDownX: evt.clientX,
      mouseDownY: evt.clientY,
      isActive: true,
      containerRect: { x, y, width, height },
      anchors: this.getAnchors(evt)
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
  };

  move = (evt: MouseEvent) => {
    const { mouseDownX, mouseDownY, containerRect } = this.state;
    if (!containerRect) return;
    let { x, y, width, height } = this.props.label.rect;
    x += this.scale(evt.clientX - mouseDownX);
    y += this.scale(evt.clientY - mouseDownY);
    // constrain to container (all sides)
    x = Math.max(Math.min(x, this.scale(containerRect.width) - width), 0);
    y = Math.max(Math.min(y, this.scale(containerRect.height) - height), 0);
    this.setState({ workingRect: { x, y, width, height } });
  };

  resize = (evt: MouseEvent) => {
    const { anchors, containerRect } = this.state;
    if (!containerRect) return;
    let { x, y, width, height } = this.props.label.rect;
    // constrain to container (top left)
    let x2 = Math.max(this.scale(evt.clientX - containerRect.x), 0);
    let y2 = Math.max(this.scale(evt.clientY - containerRect.y), 0);
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
  };

  startMoving = (evt: React.MouseEvent) => {
    if (evt.button !== 0) return;
    this.beginMoveOrResize(evt, this.move);
  };

  startResizing = (evt: React.MouseEvent) => {
    if (evt.button !== 0) return;
    this.beginMoveOrResize(evt, this.resize);
  };

  render() {
    const { workingRect: rectFromState, isActive, isHovered } = this.state;
    const { scale, label: { rect: rectFromProps, str } } = this.props;
    const rect = rectFromState || rectFromProps;
    return (
      <div
        style={{
          position: 'absolute',
          transform: `translateX(${rect.x * scale}px) translateY(${rect.y * scale}px)`,
          width: rect.width * scale,
          height: rect.height * scale,
          border: `2px solid ${hashStringToColor(str)}`,
          zIndex: isActive ? 1111 : undefined,
        }}
        ref={(ref) => ref && (this.ref = ref)}
        onContextMenu={this.removeLabel}
      >
        <div
          style={{
            position: 'absolute',
            left: -8 * scale,
            right: -8 * scale,
            top: -8 * scale,
            bottom: -8 * scale,
            cursor: this.state.resizeCursor,
          }}
          onMouseMove={this.setResizeCursor}
          onMouseDown={this.startResizing}
        />
        <div
          style={{
            position: 'absolute',
            left: 8 * scale,
            right: 8 * scale,
            top: 8 * scale,
            bottom: 8 * scale,
            cursor: 'move',
            backgroundColor: isHovered && !isActive ? 'rgba(255,255,255,0.25)' : 'transparent'
          }}
          onMouseEnter={() => this.setState({ isHovered: true })}
          onMouseLeave={() => this.setState({ isHovered: false })}
          onMouseDown={this.startMoving}
        />
        <AutocompleteInput
          type="text"
          value={str}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'hidden'
          }}
          inputStyle={{
            padding: 3,
            fontSize: 10,
            border: 0,
            maxWidth: '100%',
            maxHeight: '100%',
            textShadow: '1px 1px 2px rgba(255,255,255,0.4)',
            backgroundColor: hashStringToColor(str),
            fontWeight: 'bold',
            pointerEvents: 'all'
          }}
          suggestions={this.props.autocompleteSuggestions}
          onChange={this.handleLabelStrChange}
          onMouseDown={this.cancelEvent}
        />
      </div>
    );
  }
}
