import { fetchDownloadPaths } from '../extension/messaging';

export async function labeledImagesToPascalVOCXML(
  labeledImages: LabeledImage[],
  trainTestRatio: number = 0.8,
): Promise<ArchiveFile[]> {
  const imageFilenames = labeledImages.map(({ filename }) => filename);
  const downloadedImagePaths: string[] = await fetchDownloadPaths(imageFilenames);

  const files = labeledImages.map((li, index) => ({
    path: (Math.random() > trainTestRatio ? 'test/' : 'train/') + li.filename.replace(/\.jpg$/, '.xml'),
    data: objectToXML(
      {
        folder: downloadedImagePaths[index].replace(/\/[^\/]+$/, ''),
        filename: li.filename,
        path: downloadedImagePaths[index],
        source: { database: 'Unknown' },
        size: { width: li.width, height: li.height, depth: 3 },
        segmented: 0,
        object: li.labels.map(label => ({
          name: label.name,
          pose: 'Unspecified',
          truncated: 0,
          difficult: 0,
          bndbox: {
            xmin: label.rect.x,
            ymin: label.rect.y,
            xmax: label.rect.x + label.rect.width,
            ymax: label.rect.y + label.rect.height,
          },
        })),
      },
      'annotation',
    ),
  }));

  return files;
}

function objectToXML(obj: any, root: string): string {
  if (Array.isArray(obj)) {
    return obj.map((val: any) => objectToXML(val, root)).join('');
  }
  let children = obj;
  if (Object.getPrototypeOf(obj) === Object.prototype) {
    children = Object.keys(obj).map(key => objectToXML(obj[key], key)).join('');
  }
  return `<${root}>${children}</${root}>`;
}
