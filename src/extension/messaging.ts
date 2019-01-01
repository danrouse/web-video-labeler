// These functions are called from the web context to allow calls to unsafe
// browser runtime APIs. Messages are handled by the background process.
export type Message = {
  type: 'FETCH_DOWNLOAD_PATHS';
  filenames: string[];
};

function sendMessage(message: Message) {
  return new Promise<string[]>(resolve =>
    chrome.runtime.sendMessage(
      // runtime ID attached to DOM in injectScript while it's still in scope
      document.body.dataset.__chrome_runtime_id || '',
      message,
      resolve,
    ));
}

export function fetchDownloadPaths(filenames: string[]) {
  return sendMessage({ filenames, type: 'FETCH_DOWNLOAD_PATHS' });
}
