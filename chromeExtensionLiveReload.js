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
