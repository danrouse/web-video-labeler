import { fetchDownloadPaths } from '../extension/messaging';

interface DarknetOutputConfig {
  configURL: string;
  executablePath: string;
  width: number;
  height: number;
  trainTestRatio: number;
}

export async function labeledImagesToDarknet(
  labeledImages: LabeledImage[],
  labelClasses: string[],
  config: DarknetOutputConfig,
): Promise<ArchiveFile[]> {
  const FILENAME_TRAIN = 'train_filenames.txt';
  const FILENAME_TEST = 'test_filenames.txt';
  const FILENAME_NAMES = 'class_names.txt';
  const FILENAME_BACKUP = 'checkpoint';
  const FILENAME_DATA_CONFIG = 'darknet.cfg';
  const FILENAME_DARKNET_CONFIG = 'yolo-obj.cfg';
  const FILENAME_TRAIN_SCRIPT = 'train.sh';

  const dataConfig = [
    `classes = ${labelClasses.length}`,
    `train = ${FILENAME_TRAIN}`,
    `valid = ${FILENAME_TEST}`,
    `names = ${FILENAME_NAMES}`,
    `backup = ${FILENAME_BACKUP}`,
  ];

  const imageFilenames = labeledImages.map(({ filename }) => filename);
  const [trainImageFilenames, testImageFilenames] = splitTrainTestData(
    imageFilenames.map(f => `data/${f}`),
    config.trainTestRatio,
  );

  // training script moves all downloaded images into extracted data dir with labels
  // downloaded paths are fetched using browser extension API and piped into output script
  const imagePaths: string[] = await fetchDownloadPaths(imageFilenames);
  const trainScript = [
    '#!/bin/sh',
    `mv ${imagePaths.map(p => `"${p}"`).join(' ')} data/`,
    `${config.executablePath} detector train ${FILENAME_DATA_CONFIG} ${FILENAME_DARKNET_CONFIG}`,
  ];

  return [{
    path: FILENAME_TRAIN,
    data: trainImageFilenames.join('\n'),
  }, {
    path: FILENAME_TEST,
    data: testImageFilenames.join('\n'),
  }, {
    path: FILENAME_NAMES,
    data: labelClasses.join('\n'),
  }, {
    path: FILENAME_DATA_CONFIG,
    data: dataConfig.join('\n'),
  }, {
    path: FILENAME_DARKNET_CONFIG,
    data: await getYOLOConfig(config.configURL, labelClasses.length, config.width, config.height),
  }, {
    path: FILENAME_TRAIN_SCRIPT,
    data: trainScript.join('\n'),
    unixPermissions: '0777',
  }].concat(
    labeledImages.map(({ filename, labels, width, height }) => ({
      path: `data/${filename.replace(/\.jpg$/, '.txt')}`,
      data: labels.map(({ str, rect }) => [
        labelClasses.indexOf(str),
        (rect.x + (rect.width / 2)) / width, // x center
        (rect.y + (rect.height / 2)) / height, // y center
        rect.width / width, // width
        rect.height / height, // height
      ].join(' ')).join('\n'),
    })),
  );
}

async function getYOLOConfig(url: string, numClasses: number, width: number, height: number) {
  let yoloConfig = await fetch(url).then(r => r.text());
  yoloConfig = yoloConfig.replace(/\bbatch=\d+\b/, 'batch=64');
  yoloConfig = yoloConfig.replace(/\bsubdivisions=\d+\b/, 'subdivisions=8');
  yoloConfig = yoloConfig.replace(/\bclasses=\d+\b/g, `classes=${numClasses}`);
  yoloConfig = yoloConfig.replace(/\bfilters=255\b/g, `filters=${(numClasses + 5) * 3}`);
  yoloConfig = yoloConfig.replace(/\bwidth=\d+\b/g, `width=${width}`);
  yoloConfig = yoloConfig.replace(/\bheight=\d+\b/g, `height=${height}`);
  return yoloConfig;
}

function splitTrainTestData<T>(data: T[], ratio: number) {
  const copy = data.slice();
  copy.sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(ratio * copy.length);
  return [copy.slice(0, splitIndex), copy.slice(splitIndex)];
}
