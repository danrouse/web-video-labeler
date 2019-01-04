import { fetchDownloadPaths } from '../extension/messaging';

interface DarknetOutputConfig {
  configURL: string;
  executablePath: string;
  trainTestRatio: number;
}

// paths to output files within zip file
const FILENAME_TRAIN = 'obj.train';
const FILENAME_TEST = 'obj.test';
const FILENAME_NAMES = 'obj.names';
const FILENAME_BACKUP = 'backup';
const FILENAME_DATA_CONFIG = 'obj.index';
const FILENAME_NETWORK_CONFIG = 'yolo-obj.cfg';
const FILENAME_DATA_DIR = 'data';
const FILENAME_SCRIPT_MOVE_IMAGES = 'move_downloaded_images.sh';
const FILENAME_SCRIPT_COMBINE_PROJECTS = 'combine_projects.sh';
const FILENAME_SCRIPT_TRAIN = 'train.sh';

export async function labeledImagesToDarknet(
  labeledImages: LabeledImage[],
  labelClasses: string[],
  config: DarknetOutputConfig,
): Promise<ArchiveFile[]> {
  const imageFilenames = labeledImages.map(({ filename }) => filename);
  const [trainImageFilenames, testImageFilenames] = splitTrainTestData(
    imageFilenames.map(f => `${FILENAME_DATA_DIR}/${f}`),
    config.trainTestRatio,
  );
  const downloadedImagePaths: string[] = await fetchDownloadPaths(imageFilenames);

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
    path: FILENAME_NETWORK_CONFIG,
    data: await generateDarknetConfig(config.configURL, labelClasses.length),
  }, {
    path: FILENAME_DATA_CONFIG,
    data: generateTrainingIndex(labelClasses.length),
  }, {
    path: FILENAME_SCRIPT_MOVE_IMAGES,
    data: generateMoveImagesScript(downloadedImagePaths),
    unixPermissions: '755',
  }, {
    path: FILENAME_SCRIPT_TRAIN,
    data: generateTrainScript(config.executablePath),
    unixPermissions: '755',
  }, {
    path: FILENAME_SCRIPT_COMBINE_PROJECTS,
    data: generateCombineProjectsScript(),
    unixPermissions: '755',
  }].concat(
    labeledImages.map(li => labeledImageToDarknet(li, labelClasses)),
  );
}

const labeledImageToDarknet = ({ filename, labels, width, height }: LabeledImage, labelClasses: string[]) => ({
  path: `data/${filename.replace(/\.jpg$/, '.txt')}`,
  data: labels.map(({ name, rect }) => [
    labelClasses.indexOf(name),
    (rect.x + (rect.width / 2)) / width, // x center
    (rect.y + (rect.height / 2)) / height, // y center
    rect.width / width, // width
    rect.height / height, // height
  ].join(' ')).join('\n'),
});

async function generateDarknetConfig(url: string, numClasses: number) {
  let config = await fetch(url).then(r => r.text());
  config = config.replace(/\bbatch=\d+\b/, 'batch=64');
  config = config.replace(/\bsubdivisions=\d+\b/, 'subdivisions=8');
  config = config.replace(/\bclasses=\d+\b/g, `classes=${numClasses}`);
  config = config.replace(/\bfilters=255\b/g, `filters=${(numClasses + 5) * 3}`);
  return config;
}

function splitTrainTestData<T>(data: T[], ratio: number) {
  const copy = data.slice();
  copy.sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(ratio * copy.length);
  return [copy.slice(0, splitIndex), copy.slice(splitIndex)];
}

const generateCombineProjectsScript = () => `#!/bin/sh
if [ "$#" < 2 ]; then
  echo "Usage: $0 base_project other_project1 ...other_projectN"
  exit 1
fi

BASE_PROJECT=$1
BASE_NAMES=$(cat "$BASE_PROJECT/${FILENAME_NAMES}")
shift
for proj in "$@"; do
  if [[ $proj =~ \.zip$ ]]; then
    unzip "$proj" -o /tmp/merge_project
    move_project /tmp/merge_project
    rm -r /tmp/merge_project
  else
    move_project "$proj"
  fi
done

function move_project() {
  if [ -d "$1" ] && [ -f "$1/${FILENAME_NETWORK_CONFIG}" ]; then
    if [ "$(cat "$1/${FILENAME_NAMES}")" != "$BASE_NAMES" ]; then
      echo "$1: names (${FILENAME_NAMES}) not equal, skipping"
      return
    fi
    mv -uv "$1/${FILENAME_DATA_DIR}/*" "$BASE_PROJECT/${FILENAME_DATA_DIR}"
    sort -uR "$BASE_PROJECT/${FILENAME_TRAIN}" "$1/${FILENAME_TRAIN}" > "$BASE_PROJECT/${FILENAME_TRAIN}"
    sort -uR "$BASE_PROJECT/${FILENAME_TEST}" "$1/${FILENAME_TEST}" > "$BASE_PROJECT/${FILENAME_TEST}"
    cat "$1/${FILENAME_SCRIPT_MOVE_IMAGES}" >> "$BASE_PROJECT/${FILENAME_SCRIPT_MOVE_IMAGES}"
  else
    echo "$1: invalid project"
  fi
}
`;

const generateTrainScript = (executablePath: string) => `#!/bin/sh
shopt -s nullglob
files=(${FILENAME_DATA_DIR}/*.jpg)
if [ \${#files[@]} -eq 0 ]; then
  ./${FILENAME_SCRIPT_MOVE_IMAGES}
fi
${executablePath} detector train ${FILENAME_DATA_CONFIG} ${FILENAME_NETWORK_CONFIG}
`;

const generateMoveImagesScript = (imagePaths: string[]) => `#!/bin/sh
mv ${imagePaths.map(p => `"${p}"`).join(' ')} ${FILENAME_DATA_DIR}/
`;

const generateTrainingIndex = (numClasses: number) => `
classes = ${numClasses}
train = ${FILENAME_TRAIN}
valid = ${FILENAME_TEST}
names = ${FILENAME_NAMES}
backup = ${FILENAME_BACKUP}
`;
