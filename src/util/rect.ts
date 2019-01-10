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
  xMax: number,
  yMax: number,
): Rect {
  let { x, y, width, height } = rect; // tslint:disable-line prefer-const
  x += dx;
  y += dy;
  // constrain to container (all sides)
  x = Math.max(Math.min(x, xMax - width), 0);
  y = Math.max(Math.min(y, yMax - height), 0);
  return { x, y, width, height };
}

export function resizeRect(
  rect: Rect,
  x2: number,
  y2: number,
  xMax: number,
  yMax: number,
  anchors: Anchors,
  restrictAspectRatio: boolean = false,
): Rect {
  let { x, y, width, height } = rect;
  const ratio = width / height;
  // constrain to container (top left)
  const x2_ = Math.max(x2, 0); // tslint:disable-line
  const y2_ = Math.max(y2, 0); // tslint:disable-line
  // apply based on where the resize is anchored
  if (anchors.left) {
    width += x - x2_;
    x = x2_;
  } else if (anchors.right) {
    width = x2_ - x;
  }
  if (anchors.top) {
    height += y - y2_;
    y = y2_;
  } else if (anchors.bottom) {
    height = y2_ - y;
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
  width = Math.min(width, xMax - x);
  height = Math.min(height, yMax - y);

  if (restrictAspectRatio && (anchors.left || anchors.right) && (anchors.top || anchors.bottom)) {
    if (width / height > ratio) {
      if (x !== rect.x) {
        x -= (height / ratio) - width;
      }
      width = height / ratio;
    } else if (width / height < ratio) {
      if (y !== rect.y) {
        y -= (width / ratio) - height;
      }
      height = width / ratio;
    }
  }
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
