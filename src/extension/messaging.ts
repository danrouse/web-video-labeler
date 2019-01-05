export type Message = {
  type: 'FETCH_DOWNLOAD_PATH';
  filename: string;
} | {
  type: 'DOWNLOAD';
  url: string;
  filename: string;
};

const DOWNLOAD_PREFIX = 'web-video-labeler/';

const sendMessage = <T>(message: Message) =>
  new Promise<T>(resolve =>
    chrome.runtime.sendMessage(chrome.runtime.id, message, resolve));

export const download = (url: string, filename: string) =>
  sendMessage<void>({ url, filename, type: 'DOWNLOAD' });

export const getAbsoluteDownloadPath = (filename: string) =>
  sendMessage<string>({ filename, type: 'FETCH_DOWNLOAD_PATH' });

function messageHandler(message: Message, _: chrome.runtime.MessageSender, respond: (response: any) => void) {
  switch (message.type) {
    case 'FETCH_DOWNLOAD_PATH':
      chrome.downloads.search(
        { filenameRegex: `${DOWNLOAD_PREFIX}${message.filename}$`, limit: 1 },
        ([match]) => respond(match && match.exists ? match.filename : ''),
      );
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
  }
}

if (chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) {
  chrome.runtime.onMessage.addListener(messageHandler);
}
