let videoFrameToDataURLSharedCanvas: HTMLCanvasElement | undefined;
export default function videoFrameToDataURL(video: HTMLVideoElement, rect?: Rect, scale: number = 1) {
  videoFrameToDataURLSharedCanvas = videoFrameToDataURLSharedCanvas || document.createElement('canvas');
  const canvas = videoFrameToDataURLSharedCanvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const { width, height, x, y } = rect || {
    width: video.videoWidth,
    height: video.videoHeight,
    x: 0,
    y: 0,
  };
  canvas.width = width * scale;
  canvas.height = height * scale;
  ctx.drawImage(video, x, y, width, height, 0, 0, width * scale, height * scale);
  return canvas.toDataURL('image/jpeg');
}
