import * as React from 'react';

// TODO: Fullscreen video support
// TODO: Better tracking while video resizes?

type VideoScaleChangeHandler = (scale: number) => void;

interface Props {
  elem: HTMLVideoElement;
  children?: React.ReactNode;
  onScaleChange: VideoScaleChangeHandler;
}

interface State {
  videoRect?: Rect;
  videoScale: number;
}

export default class VideoOverlay extends React.Component<Props, State> {
  state: State = {
    videoScale: 1,
  };

  componentWillMount() {
    this.updateRect();
    const obs = new MutationObserver((mutations) => {
      // TODO: I think this causes a lot of jank
      if (!mutations.some(({ attributeName }) => attributeName === 'style')) return;
      this.updateRect();
    });
    obs.observe(this.props.elem, { attributes: true });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.elem !== this.props.elem) {
      this.updateRect(nextProps.elem);
    }
  }

  updateRect = (elem = this.props.elem) => {
    const { videoWidth, videoHeight } = elem;
    const { x, y, width: w, height: h } = elem.getBoundingClientRect() as DOMRect;
    const widthScale = w / videoWidth;
    const heightScale = h / videoHeight;
    let scale = widthScale;
    if (widthScale !== heightScale) {
      scale += (heightScale - widthScale) / 2;
    }
    if (scale !== this.state.videoScale) {
      this.props.onScaleChange(scale);
    }
    this.setState({
      videoRect: {
        x: x + window.scrollX,
        y: y + window.scrollY,
        width: w,
        height: h
      },
      videoScale: scale
    });
  };

  render() {
    if (!this.state.videoRect) return null;
    const { videoRect: { width: w, height: h, x, y } } = this.state;
    return (
      <div
        style={{
          position: 'absolute',
          width: w,
          height: h,
          left: x,
          top: y,
          zIndex: 1100,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
