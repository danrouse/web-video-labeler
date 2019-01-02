import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WebVideoLabeler from './components/WebVideoLabeler';

const MAX_RETRY_ATTEMPTS = 20;
let numRetryAttempts = 0;

function initializeReactApp() {
  // wait for video element to be ready before mounting
  const video = document.querySelector('video');
  if (!video || video.readyState !== 4) { // 4 === HTMLVideoElement.HAVE_ENOUGH_DATA
    numRetryAttempts += 1;
    if (numRetryAttempts < MAX_RETRY_ATTEMPTS) {
      setTimeout(initializeReactApp, 100);
    }
    return;
  }

  const headAppend = `
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.6.3/css/all.css"
      integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/"
      crossorigin="anonymous"
    />
  `;
  if (document.head) document.head.innerHTML += headAppend;

  const uiContainer = document.createElement('div');
  document.body.appendChild(uiContainer);
  ReactDOM.render(React.createElement(WebVideoLabeler, { video }), uiContainer);
}

initializeReactApp();
