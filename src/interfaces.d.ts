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
  // images are stored as data URLs so they can be
  // serialized and stored in local storage
  imageDataURL: string;
  filename: string;
  labels: Label[];
}

declare interface ArchiveFile {
  path: string;
  data: Blob;
}
