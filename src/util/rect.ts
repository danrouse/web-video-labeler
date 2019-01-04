export interface Anchors {
  left: boolean;
  right: boolean;
  top: boolean;
  bottom: boolean;
}

export function anchorsToCursor(anchors: Anchors) {
  let cursor = '';
  if (anchors.top) cursor += 'n';
  if (anchors.bottom) cursor += 's';
  if (anchors.left) cursor += 'w';
  if (anchors.right) cursor += 'e';
  if (cursor) cursor += '-resize';
  return cursor;
}

export function getAnchors(elem: HTMLElement | undefined, x: number, y: number, threshold: number = 12): Anchors {
  if (!elem) return { left: false, right: false, top: false, bottom: false };
  const { x: elemX, y: elemY, width, height } = elem.getBoundingClientRect() as DOMRect;
  const left = Math.abs(x - elemX) < threshold;
  const right = Math.abs(x - elemX - width) < threshold;
  const top = Math.abs(y - elemY) < threshold;
  const bottom = Math.abs(y - elemY - height) < threshold;
  return { left, right, top, bottom };
}

export function moveRect(
  rect: Rect,
  dx: number,
  dy: number,
  scale: number,
  containerRect: Rect,
): Rect {
  let { x, y, width, height } = rect; // tslint:disable-line prefer-const
  x += dx / scale;
  y += dy / scale;
  // constrain to container (all sides)
  x = Math.max(Math.min(x, (containerRect.width / scale) - width), 0);
  y = Math.max(Math.min(y, (containerRect.height / scale) - height), 0);
  return { x, y, width, height };
}

export function resizeRect(
  rect: Rect,
  dx: number,
  dy: number,
  scale: number,
  containerRect: Rect,
  anchors: Anchors,
): Rect {
  let { x, y, width, height } = rect;
  // constrain to container (top left)
  const x2 = Math.max(dx / scale, 0);
  const y2 = Math.max(dy / scale, 0);
  // apply based on where the resize is anchored
  if (anchors.left) {
    width += x - x2;
    x = x2;
  } else if (anchors.right) {
    width = x2 - x;
  }
  if (anchors.top) {
    height += y - y2;
    y = y2;
  } else if (anchors.bottom) {
    height = y2 - y;
  }
  // invert coords when moving past the origin
  if (width < 0) {
    x += width;
    width *= -1;
  }
  if (height < 0) {
    y += height;
    height *= -1;
  }
  // constrain to container (bottom right)
  width = Math.min(width, (containerRect.width / scale) - x);
  height = Math.min(height, (containerRect.height / scale) - y);
  return { x, y, width, height };
}

export function scaleRect(rect: Rect, scale: number): Rect {
  return {
    x: rect.x * scale,
    y: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale,
  };
}
