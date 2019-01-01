import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WebVideoLabeler from './components/WebVideoLabeler';
import { getYouTubeVideoElem } from './util/youtube';

function initializeReactApp() {
  // wait for video element to be ready before mounting
  const video = getYouTubeVideoElem();
  if (!video || video.readyState !== 4) { // 4 === HTMLVideoElement.HAVE_ENOUGH_DATA
    return setTimeout(initializeReactApp, 100);
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
  ReactDOM.render(React.createElement(WebVideoLabeler), uiContainer);
}

initializeReactApp();
