export function getVideoID() {
  const elem = document.querySelector('[video-id]') as HTMLElement;
  return elem.getAttribute('video-id');
}

export function getYouTubeVideoElem() {
  return document.querySelector('video') as HTMLVideoElement;
}

export function toggleYouTubeUI(enabled = false) {
  const container = document.getElementById('movie_player') as HTMLElement;
  const uiElems = container.querySelectorAll('[class^="ytp-"]');
  const classMethod = !enabled ? 'add' : 'remove';
  Array.from(uiElems).forEach(e => e.classList[classMethod]('hidden'));
}
