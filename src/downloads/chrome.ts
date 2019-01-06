const DOWNLOAD_PREFIX = 'web-video-labeler/';

type Message = {
  type: 'FETCH_DOWNLOAD_PATH';
  filename: string;
} | {
  type: 'DOWNLOAD';
  url: string;
  filename: string;
} | {
  type: 'DELETE_DOWNLOAD';
  filename: string;
};

const sendMessage = <T>(message: Message) =>
  new Promise<T>(resolve =>
    chrome.runtime.sendMessage(chrome.runtime.id, message, resolve));

export const download = (url: string, filename: string) =>
  sendMessage<void>({ url, filename, type: 'DOWNLOAD' });

export const getAbsolutePath = (filename: string) =>
  sendMessage<string>({ filename, type: 'FETCH_DOWNLOAD_PATH' });

export const deleteDownload = (filename: string) =>
  sendMessage<boolean>({ filename, type: 'DELETE_DOWNLOAD' });

if (chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) {
  const permission = () =>
    new Promise((resolve, reject) =>
      chrome.permissions.request(
        { permissions: ['downloads'] },
        (hasPerm) => {
          if (!hasPerm) return reject('permission denied');
          resolve();
        },
      ));

  function findDownload(path: string): Promise<chrome.downloads.DownloadItem | null> {
    return new Promise(resolve =>
      chrome.downloads.search(
        { filenameRegex: `${DOWNLOAD_PREFIX}${path}$`, exists: true, limit: 1 },
        ([match]) => resolve(match),
      ));
  }

  function messageHandler(message: Message, _: chrome.runtime.MessageSender, respond: (response: any) => void) {
    switch (message.type) {
      case 'FETCH_DOWNLOAD_PATH':
        permission().then(() =>
          findDownload(message.filename).then(match => respond(match ? match.filename : '')));
        return true;
      case 'DOWNLOAD':
        permission().then(() =>
          chrome.downloads.download(
            {
              url: message.url,
              filename: DOWNLOAD_PREFIX + message.filename,
            },
            respond,
          ));
        return true;
      case 'DELETE_DOWNLOAD':
        permission().then(() =>
          findDownload(message.filename).then((match) => {
            if (!match) return respond(false);
            chrome.downloads.removeFile(match.id, () =>
              chrome.downloads.erase({ id: match.id }, () =>
                respond(true)));
          }));
        return true;
    }
  }

  chrome.runtime.onMessage.addListener(messageHandler);
}
