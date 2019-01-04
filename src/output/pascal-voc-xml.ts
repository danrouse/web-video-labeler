import { fetchDownloadPaths } from '../extension/messaging';

export async function labeledImagesToPascalVOCXML(
  labeledImages: LabeledImage[],
  trainTestRatio: number = 0.8,
): Promise<ArchiveFile[]> {
  const imageFilenames = labeledImages.map(({ filename }) => filename);
  const downloadedImagePaths: string[] = await fetchDownloadPaths(imageFilenames);
  const sortedLabeledImages = labeledImages.slice().sort(() => Math.random() - 0.5);
  return sortedLabeledImages.map((li, index) => ({
    path: (index / labeledImages.length > trainTestRatio ? 'test/' : 'train/') + li.filename.replace(/\.jpg$/, '.xml'),
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
}

function objectToXML(obj: any, tag: string, indentCount: number = 0): string {
  if (Array.isArray(obj)) {
    return obj.map((val: any) => objectToXML(val, tag, indentCount)).join('');
  }
  let children = obj;
  const indent = '    '.repeat(indentCount);
  if (Object.getPrototypeOf(obj) === Object.prototype) {
    children = `\n${Object.keys(obj).map(key => objectToXML(obj[key], key, indentCount + 1)).join('')}${indent}`;
  } else if (typeof children === 'boolean') {
    children = children ? 1 : 0;
  } else if (children === null || children === undefined) {
    return `${indent}<${tag} />\n`;
  }
  return `${indent}<${tag}>${children}</${tag}>\n`;
}
