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
  return new Promise((resolve) => {
    chrome.pageAction.setIcon({
      tabId,
      path: inactiveIcon,
    });
    const destroyInstance = {
      code: `document.getElementById('${SINGLETON_ELEMENT_ID}').dispatchEvent(new Event('unmount'))`,
    };
    chrome.tabs.executeScript(tabId, destroyInstance, () => resolve());
  });
}
function createApplicationInstance(tabId: number) {
  return new Promise((resolve) => {
    chrome.tabs.insertCSS(tabId, { file: 'fontawesome.inline.min.css' });
    chrome.tabs.insertCSS(tabId, { file: 'bundle.css' });
    chrome.pageAction.setIcon({
      tabId,
      path: activeIcon,
    });
    chrome.tabs.executeScript(tabId, { file: 'bundle.js' }, () => resolve());
  });
}

const tabHasInstance = (tabId: number) => new Promise(resolve =>
  chrome.tabs.executeScript(
    tabId,
    { code: `document.getElementById('${SINGLETON_ELEMENT_ID}')` },
    existingInstance => resolve(!!(existingInstance && existingInstance[0])),
  ));

// toggle creating/destroying application instance when page action is clicked
chrome.pageAction.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  (await tabHasInstance(tab.id) ? destroyApplicationInstance : createApplicationInstance)(tab.id as number);
});

// live reloading (only active in development: hash file not included in build)
const hashFileURL = chrome.runtime.getURL('.rollup-hash');
if (hashFileURL) {
  async function reload() {
    chrome.tabs.query(
      {},
      async (tabs) => {
        for (const tab of tabs) {
          if (
            tab &&
            typeof tab.id === 'number' &&
            (tab.url || '').startsWith('http') &&
            await tabHasInstance(tab.id)
          ) {
            await destroyApplicationInstance(tab.id);
            await createApplicationInstance(tab.id);
          }
        }
        chrome.runtime.reload();
      },
    );
  }

  async function watchChanges(url: string, lastHash = '') {
    const hash = await fetch(url).then(res => res.text());
    if (lastHash && hash !== lastHash) {
      reload();
    } else {
      setTimeout(() => watchChanges(url, hash), 1000);
    }
  }

  watchChanges(hashFileURL);
}
