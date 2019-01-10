import * as React from 'react';
import * as ReactDOM from 'react-dom';
import WebVideoLabeler from './components/WebVideoLabeler';

function initializeReactApp() {
  // wait for video element to be ready before mounting
  const video = document.querySelector('video');
  if (!video || video.readyState !== 4) { // 4 === HTMLVideoElement.HAVE_ENOUGH_DATA
    setTimeout(initializeReactApp, 250);
    return;
  }
  const uiContainer = document.createElement('div');
  uiContainer.id = 'WebVideoLabeler';
  document.body.appendChild(uiContainer);
  ReactDOM.render(React.createElement(WebVideoLabeler, { video }), uiContainer);

  // allow the browser to request an unmount
  uiContainer.addEventListener('unmount' as any, () => {
    ReactDOM.unmountComponentAtNode(uiContainer);
    document.body.removeChild(uiContainer);
  });
}

initializeReactApp();
