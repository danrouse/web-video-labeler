import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import { getYouTubeVideoElem } from './util/youtube';

function initializeReactApp() {
  // wait for video element to be ready before mounting
  const video = getYouTubeVideoElem();
  if (!video || video.readyState !== 4) { // 4 === HTMLVideoElement.HAVE_ENOUGH_DATA
    return setTimeout(initializeReactApp, 100);
  }

  const uiContainer = document.createElement('div');
  document.body.appendChild(uiContainer);
  ReactDOM.render(React.createElement(App), uiContainer);
}

initializeReactApp();
