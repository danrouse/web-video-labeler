import * as chromeDownloads from './chrome';
import s3 from './s3';

interface DownloadInterface {
  download: (url: string, filename: string) => Promise<any>;
  getAbsolutePath: (filename: string) => Promise<string>;
  deleteDownload: (filename: string) => Promise<boolean>;
}

// cache S3 interface based on user credentials,
// so a new one will be automatically created if they are changed
let cachedS3Interface: DownloadInterface;
let cachedS3InterfaceKey: string;
const cacheKey = (settings: UserSettings) => settings.s3AWSRegion + settings.s3AWSBucket + settings.s3AWSAccessKeyID;

function getInterfaceMethod(method: keyof DownloadInterface, settings: UserSettings) {
  if (settings.saveToS3) {
    const key = cacheKey(settings);
    if (!cachedS3Interface || cachedS3InterfaceKey !== key) {
      cachedS3Interface = s3(
        settings.s3AWSRegion, settings.s3AWSAccessKeyID, settings.s3AWSSecretAccessKey, settings.s3AWSBucket,
      );
      cachedS3InterfaceKey = key;
    }
    return cachedS3Interface[method];
  }
  return chromeDownloads[method];
}

export const download = (url: string, filename: string, settings: UserSettings) =>
  (getInterfaceMethod('download', settings) as DownloadInterface['download'])(url, filename);

export const getAbsolutePath = (filename: string, settings: UserSettings) =>
  (getInterfaceMethod('getAbsolutePath', settings) as DownloadInterface['getAbsolutePath'])(filename);

export const deleteDownload = (filename: string, settings: UserSettings) =>
  (getInterfaceMethod('deleteDownload', settings) as DownloadInterface['deleteDownload'])(filename);
