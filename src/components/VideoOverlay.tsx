import * as React from 'react';
import throttle from '../util/throttle';

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
    const obs = new MutationObserver(() => this.updateRect());
    obs.observe(this.props.elem, { attributes: true, attributeFilter: ['style', 'width', 'height'] });
    window.addEventListener('fullscreenchange', () => this.updateRect(this.props.elem));
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.elem !== this.props.elem) {
      this.updateRect(nextProps.elem);
    }
  }

  updateRect = throttle(
    (elem = this.props.elem) => {
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
          height: h,
        },
        videoScale: scale,
      });
    },
    100, true);

  render() {
    if (!this.state.videoRect) return null;
    const { videoRect: { width, height, x, y } } = this.state;
    return (
      <div
        style={{
          width,
          height,
          left: x,
          top: y,
          pointerEvents: 'none',
          position: 'absolute',
          zIndex: 1100,
        }}
      >
        {this.props.children}
      </div>
    );
  }
}
