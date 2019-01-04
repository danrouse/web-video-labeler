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

  // TODO
  // Pascal VOC XML only
  occluded?: boolean;
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
  saveCroppedImages: boolean;
  saveImagesWithoutLabels: boolean;
  savedImageScale: number;
  gridSize: number;

  outputFormat: OutputFormat;
  trainTestRatio: number;
  darknetExecutablePath: string;
  darknetConfigURL: string;
}

declare type OutputFormat = 'DARKNET' | 'PASCALVOCXML' | 'JSON';
