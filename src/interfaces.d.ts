declare interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare interface Label {
  rect: Rect;
  name: string;

  subclasses?: string[];

  truncated?: boolean;
  difficult?: boolean;
  pose?: string;
}

declare interface LabeledImage {
  url: string;
  time: number;
  frame: number;
  width: number;
  height: number;

  filename: string;
  labels: Label[];
}

declare interface ArchiveFile {
  path: string;
  data: Blob | string;
  unixPermissions?: string | number;
}

declare interface UserSettings {
  skipLength: number;
  skipLengthFrameRate: number;
  useCorrelationTracker: boolean;
  saveCroppedImages: boolean;
  saveImagesWithoutLabels: boolean;
  savedImageScale: number;
  saveDarknet: boolean;
  savePascalVOCXML: boolean;
  saveJSON: boolean;

  gridSize: number;
  projectName: string;

  saveToS3: boolean;
  s3AWSRegion: string;
  s3AWSAccessKeyID: string;
  s3AWSSecretAccessKey: string;
  s3AWSBucket: string;
}
