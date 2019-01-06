import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WebVideoLabeler from './components/WebVideoLabeler';

const SINGLETON_ELEMENT_ID = 'WebVideoLabeler';

function initializeReactApp() {
  // wait for video element to be ready before mounting
  const video = document.querySelector('video');
  if (!video || video.readyState !== 4) { // 4 === HTMLVideoElement.HAVE_ENOUGH_DATA
    setTimeout(initializeReactApp, 250);
    return;
  }

  const faStylesheet = document.createElement('link');
  faStylesheet.rel = 'stylesheet';
  faStylesheet.href = 'https://use.fontawesome.com/releases/v5.6.3/css/all.css';
  faStylesheet.integrity = 'sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/';
  faStylesheet.crossOrigin = 'anonymous';
  if (document.head) document.head.appendChild(faStylesheet);

  const uiContainer = document.createElement('div');
  uiContainer.id = SINGLETON_ELEMENT_ID;
  document.body.appendChild(uiContainer);
  ReactDOM.render(React.createElement(WebVideoLabeler, { video }), uiContainer);
}

const existingInstance = document.getElementById(SINGLETON_ELEMENT_ID);
if (existingInstance) {
  ReactDOM.unmountComponentAtNode(existingInstance);
  document.body.removeChild(existingInstance);
} else {
  initializeReactApp();
}
