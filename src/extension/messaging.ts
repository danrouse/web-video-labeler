// These functions are called from the web context to allow calls to unsafe
// browser runtime APIs. Messages are handled by the background process.
export type Message = {
  type: 'FETCH_DOWNLOAD_PATHS';
  filenames: string[];
};

// Message sender gets bound to Document from content script injector
declare global {
  interface Document {
    _sendMessage: <T>(message: Message) => Promise<T>;
  }
}

export function fetchDownloadPaths(filenames: string[]) {
  return document._sendMessage<string[]>({ filenames, type: 'FETCH_DOWNLOAD_PATHS' });
}
