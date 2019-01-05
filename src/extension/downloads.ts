export type Message = {
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

const DOWNLOAD_PREFIX = 'web-video-labeler/';

const sendMessage = <T>(message: Message) =>
  new Promise<T>(resolve =>
    chrome.runtime.sendMessage(chrome.runtime.id, message, resolve));

export const download = (url: string, filename: string) =>
  sendMessage<void>({ url, filename, type: 'DOWNLOAD' });

export const getAbsolutePath = (filename: string) =>
  sendMessage<string>({ filename, type: 'FETCH_DOWNLOAD_PATH' });

export const deleteDownload = (filename: string) =>
  sendMessage<boolean>({ filename, type: 'DELETE_DOWNLOAD' });

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
      findDownload(message.filename).then(match => respond(match ? match.filename : ''));
      return true;
    case 'DOWNLOAD':
      chrome.downloads.download(
        {
          url: message.url,
          filename: DOWNLOAD_PREFIX + message.filename,
        },
        respond,
      );
      return true;
    case 'DELETE_DOWNLOAD':
      findDownload(message.filename).then((match) => {
        console.log('fd', message.filename, match);
        if (!match) return respond(false);
        chrome.downloads.removeFile(match.id, () =>
          chrome.downloads.erase({ id: match.id }, () =>
            respond(true)));
      });
      return true;
  }
}

if (chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) {
  chrome.runtime.onMessage.addListener(messageHandler);
}
