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
function videoFrameToDataURL(video: HTMLVideoElement, rect?: Rect) {
  videoFrameToDataURLSharedCanvas = videoFrameToDataURLSharedCanvas || document.createElement('canvas');
  const canvas = videoFrameToDataURLSharedCanvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const width = rect ? rect.width : video.videoWidth;
  const height = rect ? rect.height : video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(video, rect ? rect.x : 0, rect ? rect.y : 0, width, height, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg');
}

async function filesToZIPFileDataURL(files: ArchiveFile[]) {
  const zip = new JSZip();
  files.forEach(({ path, data }) => zip.file(path, data));
  const b64 = await zip.generateAsync({ type: 'base64', compression: 'DEFLATE' });
  return `data:application/octet-stream;base64,${b64}`;
}

export function downloadVideoFrame(video: HTMLVideoElement, filename: string, rect?: Rect) {
  downloadDataURL(videoFrameToDataURL(video, rect), filename);
}

export async function downloadZIPFile(files: ArchiveFile[], filename: string = 'data.zip') {
  downloadDataURL(await filesToZIPFileDataURL(files), filename);
}
