export type Message = {
  type: 'FETCH_DOWNLOAD_PATHS';
  filenames: string[];
};

const sendMessage = <T>(message: Message) =>
  new Promise<T>(resolve =>
    chrome.runtime.sendMessage(chrome.runtime.id, message, resolve));

export function fetchDownloadPaths(filenames: string[]) {
  return sendMessage<string[]>({ filenames, type: 'FETCH_DOWNLOAD_PATHS' });
}

const getDownloadedPath = async (filename: string) =>
  new Promise(resolve =>
    chrome.downloads.search(
      { filenameRegex: `${filename}$`, limit: 1 },
      ([{ filename }]) => resolve(filename)),
    );

function messageHandler(message: Message, _: chrome.runtime.MessageSender, respond: (response: any) => void) {
  switch (message.type) {
    case 'FETCH_DOWNLOAD_PATHS':
      Promise.all(message.filenames.map(getDownloadedPath)).then(paths => respond(paths));
      return true;
  }
}

if (chrome.extension.getBackgroundPage && chrome.extension.getBackgroundPage() === window) {
  chrome.runtime.onMessage.addListener(messageHandler);
}
