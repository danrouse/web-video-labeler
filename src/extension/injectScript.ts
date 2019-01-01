document.body.dataset.__chrome_runtime_id = chrome.runtime.id;
// Inject main script to run inside the context of the page
// in order to access the page's Javascript scope
const SCRIPT_URL = chrome.extension.getURL('dist/bundle.js');
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', SCRIPT_URL);
document.body.appendChild(script);

const STYLE_URL = chrome.extension.getURL('dist/bundle.css');
const style = document.createElement('link');
style.setAttribute('rel', 'stylesheet');
style.setAttribute('href', STYLE_URL);
document.head && document.head.appendChild(style);
