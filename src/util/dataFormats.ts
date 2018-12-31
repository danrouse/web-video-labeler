import { downloadDataURL } from './dataURL';

function getDownloadedPaths(filenames: string[]) {
  return new Promise<string[]>(resolve =>
    chrome.runtime.sendMessage(
      document.body.dataset.__chrome_runtime_id || '',
      { filenames, type: 'FETCH_DOWNLOAD_PATHS' },
      resolve,
    ));
}

export async function labeledImagesToDarknet(
  labeledImages: LabeledImage[],
  labelClasses: string[],
  configURL: string,
  executablePath: string = './darknet',
  nnWidth: number = 416,
  nnHeight: number = 416,
): Promise<ArchiveFile[]> {
  labeledImages.forEach(({ filename, labels, width, height }) =>
    downloadDataURL(
      `data:text/plain;charset=utf-8,${encodeURIComponent(
        labels.map(({ str, rect }) => [
          labelClasses.indexOf(str),
          (rect.x + (rect.width / 2)) / width, // x center
          (rect.y + (rect.height / 2)) / height, // y center
          rect.width / width, // width
          rect.height / height, // height
        ].join(' ')).join('\n'),
      )}`,
      filename.replace(/\.jpg$/, '.txt'),
    ));
  const paths: string[] = await getDownloadedPaths(labeledImages.map(({ filename }) => filename));
  const files: ArchiveFile[] = [];
  files.push({
    path: 'train_filenames.txt',
    data: paths.join('\n'),
  });
  files.push({
    path: 'class_names.txt',
    data: labelClasses.join('\n'),
  });
  files.push({
    path: 'train.cfg',
    data: `
      classes = ${labelClasses.length}
      train = train_filenames.txt
      valid = test_filenames.txt
      names = class_names.txt
      backup = backup/
    `.trim(),
  });

  let yoloConfig = await fetch(configURL).then(r => r.text());
  yoloConfig = yoloConfig.replace(/\bbatch=\d+\b/, 'batch=64');
  yoloConfig = yoloConfig.replace(/\bsubdivisions=\d+\b/, 'subdivisions=8');
  yoloConfig = yoloConfig.replace(/\bclasses=\d+\b/g, `classes=${labelClasses.length}`);
  yoloConfig = yoloConfig.replace(/\bfilters=255\b/g, `filters=${(labelClasses.length + 5) * 3}`);
  yoloConfig = yoloConfig.replace(/\bwidth=\d+\b/g, `width=${nnWidth}`);
  yoloConfig = yoloConfig.replace(/\bheight=\d+\b/g, `height=${nnHeight}`);

  files.push({
    path: 'yolo-obj.cfg',
    data: yoloConfig,
  });

  files.push({
    path: 'train.sh',
    data: `${executablePath} detector train train.cfg yolo-obj.cfg\n`,
  });

  return files;
}
