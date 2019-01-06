import { getAbsolutePath } from '../downloads';

export const labeledImageToPascalVOCXML = async (li: LabeledImage, settings: UserSettings): Promise<ArchiveFile> => {
  const absPath = await getAbsolutePath(li.filename, settings);
  return {
    path: li.filename.replace(/\.jpg$/, '.xml'),
    data: objectToXML(
      {
        folder: absPath ? absPath.replace(/\/[^\/]+$/, '') : '',
        filename: li.filename,
        path: absPath,
        source: { database: 'Unknown' },
        size: { width: li.width, height: li.height, depth: 3 },
        segmented: 0,
        object: li.labels.map(label => ({
          name: label.name,
          pose: label.pose || 'Unspecified',
          truncated: label.truncated ? 1 : 0,
          difficult: label.difficult ? 1 : 0,
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
  };
};

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
