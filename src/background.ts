chrome.pageAction.onClicked.addListener((tab) => {
  if (!tab.id) return;
  chrome.tabs.executeScript(tab.id as number, { code: 'document.getElementById("WebVideoLabeler")' }, ([elem]) => {
    if (elem) {
      chrome.pageAction.setIcon({
        path: { 19: 'icon-inactive-19.png', 38: 'icon-inactive-38.png' },
        tabId: tab.id as number,
      });
    } else {
      chrome.tabs.insertCSS(tab.id as number, { file: 'bundle.css' });
      chrome.pageAction.setIcon({
        path: { 19: 'icon-active-19.png', 38: 'icon-active-38.png' },
        tabId: tab.id as number,
      });
    }
    chrome.tabs.executeScript(tab.id as number, { file: 'bundle.js' });
  });
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.declarativeContent.onPageChanged.addRules([{
    conditions: [
      new chrome.declarativeContent.PageStateMatcher({
        css: ['video'],
      }),
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()],
  }]);
});

const hashFileURL = chrome.runtime.getURL('.rollup-hash');
if (hashFileURL) {
  function reload() {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      ([activeTab]) => {
        if (activeTab && typeof activeTab.id === 'number') chrome.tabs.reload(activeTab.id);
        chrome.runtime.reload();
      },
    );
  }

  async function watchChanges(url: string, lastHash = '') {
    const hash = await fetch(url).then(res => res.text());
    if (lastHash && hash !== lastHash) {
      reload();
    } else {
      setTimeout(() => watchChanges(url, hash), 100);
    }
  }

  watchChanges(hashFileURL);
}
