/* eslint-disable no-plusplus */
import { geoMercator } from 'd3-geo';
import { epsilon } from './math';
import { fitExtent, fitSize } from './fit';

const defaultScale = 3000;

// The projections must have mutually exclusive clip regions on the sphere,
// as this will avoid emitting interleaving lines and polygons.
function multiplex(streams) {
  const n = streams.length;
  return {
    point(x, y) { let i = -1; while (++i < n) streams[i].point(x, y); },
    sphere() { let i = -1; while (++i < n) streams[i].sphere(); },
    lineStart() { let i = -1; while (++i < n) streams[i].lineStart(); },
    lineEnd() { let i = -1; while (++i < n) streams[i].lineEnd(); },
    polygonStart() { let i = -1; while (++i < n) streams[i].polygonStart(); },
    polygonEnd() { let i = -1; while (++i < n) streams[i].polygonEnd(); },
  };
}

// A composite projection for Taiwan, configured by default for
// 960×500. The projection also works quite well at 960×600 if you change the
// scale to 1285 and adjust the translate accordingly.
export default () => {
  let cache;
  let cacheStream;

  // Longitude and latitude coordinates of their centers
  const mainland = geoMercator().rotate([-120.97, -23.6]); let mainlandPoint;
  const kinmen = geoMercator().rotate([-118.33, -24.44]); let kinmenPoint;
  const lienchiang = geoMercator().rotate([-120.2245113, -26.162376]); let lienchiangPoint;
  const wuqiu = geoMercator().rotate([-119.45, -24.98]); let wuqiuPoint;

  let point;
  const pointStream = { point(x, y) { point = [x, y]; } };

  const mercatorTw = (coordinates) => {
    const x = coordinates[0];
    const y = coordinates[1];
    point = null;
    return (mainlandPoint.point(x, y), point)
      || (kinmenPoint.point(x, y), point)
      || (lienchiangPoint.point(x, y), point)
      || (wuqiuPoint.point(x, y), point);
  };

  const reset = () => {
    cache = null;
    cacheStream = null;
    return mercatorTw;
  };

  mercatorTw.invert = (coordinates) => {
    const k = mainland.scale();
    const t = mainland.translate();
    const x = (coordinates[0] - t[0]) / k;
    const y = (coordinates[1] - t[1]) / k;
    // TODO fix
    // eslint-disable-next-line no-nested-ternary
    return (y >= 0.120 && y < 0.234 && x >= -0.425 && x < -0.214 ? kinmen
      : y >= 0.166 && y < 0.234 && x >= -0.214 && x < -0.115 ? lienchiang
        : mainland).invert(coordinates);
  };

  // eslint-disable-next-line no-return-assign
  mercatorTw.stream = (stream) => (cache && cacheStream === stream
    ? cache
    : cache = multiplex([
      mainland.stream(cacheStream = stream),
      kinmen.stream(stream),
      lienchiang.stream(stream),
      wuqiu.stream(stream),
    ]));

  mercatorTw.precision = (...args) => {
    if (!args.length) return mainland.precision();
    mainland.precision(args[0]);
    kinmen.precision(args[0]);
    lienchiang.precision(args[0]);
    wuqiu.precision(args[0]);
    return reset();
  };

  mercatorTw.scale = (...args) => {
    if (!args.length) return mainland.scale();
    mainland.scale(args[0]);
    kinmen.scale(args[0]);
    lienchiang.scale(args[0]);
    wuqiu.scale(args[0]);
    return mercatorTw.translate(mainland.translate());
  };

  mercatorTw.translate = (...args) => {
    if (!args.length) return mainland.translate();
    const k = mainland.scale();
    const x = +args[0][0];
    const y = +args[0][1];

    // Takes the bbox difference between the corner and the center to
    // determine where to clip.
    mainlandPoint = mainland
      .translate(args[0])
      .clipExtent([
        [x - (80 / defaultScale) * k, y - (100 / defaultScale) * k],
        [x + (80 / defaultScale) * k, y + (100 / defaultScale) * k],
      ])
      .stream(pointStream);

    // TODO Fix
    kinmenPoint = kinmen
      .translate([x - 0 * k, y + 0 * k])
      .clipExtent([
        [x - 0 * k + epsilon, y + 0 * k + epsilon],
        [x - 0 * k - epsilon, y + 0 * k - epsilon]])
      .stream(pointStream);

    lienchiangPoint = lienchiang
      .translate([x - 0 * k, y + 0 * k])
      .clipExtent([
        [x - 0 * k + epsilon, y + 0 * k + epsilon],
        [x - 0 * k - epsilon, y + 0 * k - epsilon]])
      .stream(pointStream);

    wuqiuPoint = wuqiu
      .translate([x - 0 * k, y + 0 * k])
      .clipExtent([
        [x - 0 * k + epsilon, y + 0 * k + epsilon],
        [x - 0 * k - epsilon, y + 0 * k - epsilon]])
      .stream(pointStream);

    return reset();
  };

  mercatorTw.fitExtent = (extent, object) => fitExtent(mercatorTw, extent, object);
  mercatorTw.fitSize = (size, object) => fitSize(mercatorTw, size, object);

  return mercatorTw.scale(defaultScale);
};
