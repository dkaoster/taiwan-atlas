function noop() {}

let x0 = Infinity;
let y0 = x0;
let x1 = -x0;
let y1 = x1;

function boundsPoint(x, y) {
  if (x < x0) x0 = x;
  if (x > x1) x1 = x;
  if (y < y0) y0 = y;
  if (y > y1) y1 = y;
}

const boundsStream = {
  point: boundsPoint,
  lineStart: noop,
  lineEnd: noop,
  polygonStart: noop,
  polygonEnd: noop,
  result() {
    const bounds = [[x0, y0], [x1, y1]];
    // eslint-disable-next-line no-multi-assign
    x1 = y1 = -(y0 = x0 = Infinity);
    return bounds;
  },
};

export default boundsStream;
