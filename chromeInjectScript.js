// Inject main script to run inside the context of the page
// in order to access the page's Javascript scope
const SCRIPT_URL = chrome.extension.getURL('dist/bundle.js');
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', SCRIPT_URL);
document.body.appendChild(script);
