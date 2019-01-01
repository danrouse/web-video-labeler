const getDownloadedPath = async (filename: string) =>
  new Promise(resolve =>
    chrome.downloads.search(
      { filenameRegex: `${filename}$`, limit: 1 },
      ([{ filename }]) => resolve(filename)),
    );

chrome.runtime.onMessageExternal.addListener((message, _, respond) => {
  if (message.type !== 'FETCH_DOWNLOAD_PATHS') return;
  Promise.all(message.filenames.map(getDownloadedPath)).then(paths => respond(paths));
  return true;
});
