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
  if (lastHash && hash !== lastHash) reload();
  setTimeout(() => watchChanges(url, hash, 1000));
}

const hashFileURL = chrome.runtime.getURL('.rollup-hash');
watchChanges(hashFileURL);
