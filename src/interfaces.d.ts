declare interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

declare interface Label {
  rect: Rect;
  str: string;
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
}

declare interface UserSettings {
  skipLength: number;
  skipLengthFrameRate: number;
  saveCroppedImages: boolean;
  saveImagesWithoutLabels: boolean;

  darknetWidth: number;
  darknetHeight: number;
  darknetExecutablePath: string;
  darknetConfigURL: string;
}
