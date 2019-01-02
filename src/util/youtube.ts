const isOnYouTube = () => window.location.host.match(/\.youtube\.com$/);

export function getVideoID() {
  if (!isOnYouTube()) return;
  const elem = document.querySelector('[video-id]');
  return elem && elem.getAttribute('video-id');
}

export function toggleYouTubeUI(enabled = false) {
  if (!isOnYouTube()) return;
  const container = document.getElementById('movie_player');
  if (!container) return;
  const uiElems = container.querySelectorAll('[class^="ytp-"]');
  const classMethod = !enabled ? 'add' : 'remove';
  Array.from(uiElems).forEach(e => e.classList[classMethod]('hidden'));
}
