function reload() {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    ([ activeTab ]) => {
      if (activeTab) chrome.tabs.reload(activeTab.id);
      chrome.runtime.reload();
    }
  );
};

async function watchChanges(url, lastHash = '') {
  const hash = await fetch(url).then(res => res.text());
  if (lastHash && hash !== lastHash) {
    reload();
  } else {
    setTimeout(() => watchChanges(url, hash), 100);
  }
}

const hashFileURL = chrome.runtime.getURL('.rollup-hash');
watchChanges(hashFileURL);

const getDownloadedPath = async (filename) =>
  new Promise(resolve =>
    chrome.downloads.search(
      { filenameRegex: filename + '$', limit: 1 },
      ([{ filename }]) => resolve(filename)),
    );

chrome.runtime.onMessageExternal.addListener(function (message, sender, respond) {
  if (message.type !== 'FETCH_DOWNLOAD_PATHS') return;
  Promise.all(message.filenames.map(getDownloadedPath)).then(paths => respond(paths));
  return true;
});
