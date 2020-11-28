/* eslint-disable no-plusplus */
import { mercator } from 'd3-geo';
import {
  fitExtent, fitSize, fitWidth, fitHeight,
} from 'd3-geo/src/projection/fit';
import { epsilon } from 'd3-geo/src/math';

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
// scale to 1285 and adjust the translate accordingly. The set of standard
// parallels for each region comes from USGS, which is published here:
// http://egsc.usgs.gov/isb/pubs/MapProjections/projections.html#albers
export default () => {
  let cache;
  let cacheStream;

  const mainland = mercator(); let mainlandPoint;
  const kinmen = mercator().center([-2, 58.5]).parallels([55, 65]); let kinmenPoint;
  const lienchiang = mercator().center([-3, 19.9]).parallels([8, 18]); let lienchiangPoint;
  const wuqiu = mercator().center([-3, 19.9]).parallels([8, 18]); let wuqiuPoint;

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

    mainlandPoint = mainland
      .translate(args[0])
      .clipExtent([[x - 0.455 * k, y - 0.238 * k], [x + 0.455 * k, y + 0.238 * k]])
      .stream(pointStream);

    // TODO Fix
    kinmenPoint = kinmen
      .translate([x - 0.307 * k, y + 0.201 * k])
      .clipExtent([
        [x - 0.425 * k + epsilon, y + 0.120 * k + epsilon],
        [x - 0.214 * k - epsilon, y + 0.234 * k - epsilon]])
      .stream(pointStream);

    lienchiangPoint = lienchiang
      .translate([x - 0.205 * k, y + 0.212 * k])
      .clipExtent([
        [x - 0.214 * k + epsilon, y + 0.166 * k + epsilon],
        [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
      .stream(pointStream);

    wuqiuPoint = wuqiu
      .translate([x - 0.205 * k, y + 0.212 * k])
      .clipExtent([
        [x - 0.214 * k + epsilon, y + 0.166 * k + epsilon],
        [x - 0.115 * k - epsilon, y + 0.234 * k - epsilon]])
      .stream(pointStream);

    return reset();
  };

  mercatorTw.fitExtent = (extent, object) => fitExtent(mercatorTw, extent, object);
  mercatorTw.fitSize = (size, object) => fitSize(mercatorTw, size, object);
  mercatorTw.fitWidth = (width, object) => fitWidth(mercatorTw, width, object);
  mercatorTw.fitHeight = (height, object) => fitHeight(mercatorTw, height, object);

  return mercatorTw.scale(1070);
};
