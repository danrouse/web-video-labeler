const SINGLETON_ELEMENT_ID = 'WebVideoLabeler';

// only enable the extension's page action when a video is on the page
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

const activeIcon = { 19: 'icons/icon-active-19.png', 38: 'icons/icon-active-38.png' };
const inactiveIcon = { 19: 'icons/icon-inactive-19.png', 38: 'icons/icon-inactive-38.png' };
function destroyApplicationInstance(tabId: number) {
  chrome.pageAction.setIcon({
    tabId,
    path: inactiveIcon,
  });
  const destroyInstance = { code: `document.body.removeChild(document.getElementById('${SINGLETON_ELEMENT_ID}'))` };
  chrome.tabs.executeScript(tabId, destroyInstance);
}
function createApplicationInstance(tabId: number) {
  chrome.tabs.insertCSS(tabId, { file: 'fontawesome.inline.min.css' });
  chrome.tabs.insertCSS(tabId, { file: 'bundle.css' });
  chrome.pageAction.setIcon({
    tabId,
    path: activeIcon,
  });
  chrome.tabs.executeScript(tabId, { file: 'bundle.js' });
}

// toggle creating/destroying application instance when page action is clicked
chrome.pageAction.onClicked.addListener((tab) => {
  if (!tab.id) return;
  const findExistingInstance = { code: `document.getElementById('${SINGLETON_ELEMENT_ID}')` };
  chrome.tabs.executeScript(tab.id, findExistingInstance, ([existingInstance]) =>
    (existingInstance ? destroyApplicationInstance : createApplicationInstance)(tab.id as number));
});

// live reloading (only active in development: hash file not included in build)
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
