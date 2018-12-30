import * as JSZip_ from 'jszip';
// TypeScript definitions don't match with the export format of the
// (overloaded) version of JSZip included in the rollup bundle.
// JSZip is aliased in rollup because of module bundling issues.
const JSZip: JSZip_ = (JSZip_ as any).default;

function downloadDataURL(data: string, filename: string) {
  const elem = document.createElement('a');
  elem.href = data;
  elem.download = filename;
  elem.click();
}

let _videoFrameToDataURLCanvas: HTMLCanvasElement | undefined;
export function videoFrameToDataURL(video: HTMLVideoElement) {
  _videoFrameToDataURLCanvas = _videoFrameToDataURLCanvas || document.createElement('canvas');
  const canvas = _videoFrameToDataURLCanvas;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  return canvas.toDataURL('image/jpeg');
}

async function filesToZIPDataURL(files: ArchiveFile[]) {
  const zip = new JSZip();
  files.forEach(({ path, data }) => zip.file(path, data));
  const b64 = await zip.generateAsync({ type: 'base64', compression: 'DEFLATE' });
  return `data:application/octet-stream;base64,${b64}`;
}

export async function downloadFiles(files: ArchiveFile[], filename: string = 'data.zip') {
  downloadDataURL(await filesToZIPDataURL(files), filename);
}

let _imageDataURLToBlobCanvas: HTMLCanvasElement | undefined;
export function imageDataURLToBlob(dataURL: string, rect?: Rect): Promise<Blob> {
  return new Promise((resolve) => {
    _imageDataURLToBlobCanvas = _imageDataURLToBlobCanvas || document.createElement('canvas');
    const canvas = _imageDataURLToBlobCanvas;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const image = new Image();
    image.onload = () => {
      const width = rect ? rect.width : image.width;
      const height = rect ? rect.height : image.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, rect ? rect.x : 0, rect ? rect.y : 0, width, height, 0, 0, width, height);
      canvas.toBlob(blob => resolve(blob || new Blob()), 'image/jpeg');
    };
    image.src = dataURL;
  });
}
