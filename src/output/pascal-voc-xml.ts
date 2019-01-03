import { fetchDownloadPaths } from '../extension/messaging';

export async function labeledImagesToPascalVOCXML(
  labeledImages: LabeledImage[],
  trainTestRatio: number,
): Promise<ArchiveFile[]> {
  const imageFilenames = labeledImages.map(({ filename }) => filename);
  const downloadedImagePaths: string[] = await fetchDownloadPaths(imageFilenames);

  const files = labeledImages.map((li, index) => ({
    path: (Math.random() > trainTestRatio ? 'test/' : 'train/') + li.filename.replace(/\.jpg$/, '.xml'),
    data:
`<annotation>
    <folder>${downloadedImagePaths[index].replace(/\/[^\/]+$/, '')}</folder>
    <filename>${li.filename}</filename>
    <path>${downloadedImagePaths[index]}</path>
    <source>
        <database>Unknown</database>
    </source>
    <size>
        <width>${li.width}</width>
        <height>${li.height}</height>
        <depth>3</depth>
    </size>
    <segmented>0</segmented>
${li.labels.map(label =>
`    <object>
        <name>${label.str}</name>
        <pose>Unspecified</pose>
        <truncated>0</truncated>
        <difficult>0</difficult>
        <bndbox>
            <xmin>${label.rect.x}</xmin>
            <ymin>${label.rect.y}</ymin>
            <xmax>${label.rect.x + label.rect.width}</xmax>
            <ymax>${label.rect.y + label.rect.height}</ymax>
        </bndbox>
    </object>
`)}
</annotation>
`,
  }));

  return files;
}
