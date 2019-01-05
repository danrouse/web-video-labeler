export const labeledImageToDarknet = ({ filename, labels, width, height }: LabeledImage) => ({
  path: filename.replace(/\.jpg$/, '.darknet-unprepared.txt'),
  data: labels.map(({ name, rect }) => [
    name,
    (rect.x + (rect.width / 2)) / width, // x center
    (rect.y + (rect.height / 2)) / height, // y center
    rect.width / width, // width
    rect.height / height, // height
  ].join(' ')).join('\n'),
});
