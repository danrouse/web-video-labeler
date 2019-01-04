import * as JSZip_ from 'jszip';
// TypeScript definitions don't match with the export format of the
// (overloaded) version of JSZip included in the rollup bundle.
// JSZip is aliased in rollup because of module bundling issues.
const JSZip: JSZip_ = (JSZip_ as any).default; // tslint:disable-line variable-name

export function downloadDataURL(data: string, filename: string) {
  const elem = document.createElement('a');
  elem.href = data;
  elem.download = filename;
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}

let videoFrameToDataURLSharedCanvas: HTMLCanvasElement | undefined;
export function videoFrameToDataURL(video: HTMLVideoElement, rect?: Rect, scale: number = 1) {
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

async function filesToZIPFileDataURL(files: ArchiveFile[]) {
  const zip = new JSZip();
  files.forEach(({ path, data, ...otherOptions }) => zip.file(path, data, otherOptions));
  const b64 = await zip.generateAsync({ type: 'base64', compression: 'DEFLATE' });
  return `data:application/octet-stream;base64,${b64}`;
}

export function downloadVideoFrame(video: HTMLVideoElement, filename: string, rect?: Rect, scale?: number) {
  downloadDataURL(videoFrameToDataURL(video, rect, scale), filename);
}

export async function downloadZIPFile(files: ArchiveFile[], filename: string = 'data.zip') {
  downloadDataURL(await filesToZIPFileDataURL(files), filename);
}
