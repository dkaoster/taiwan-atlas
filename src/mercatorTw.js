/* eslint-disable no-plusplus */
import { geoMercator } from 'd3-geo';
import { path } from 'd3-path';
import { epsilon } from './math';
import { fitExtent, fitSize } from './fit';

const defaultScale = 10000;
const defaultCenter = [275, 300];

// Geo coordinates for projection boxes given defaultScale of 10000.
const geoCoordinates = {
  mainland: {
    width: 360, height: 600, offsetX: 0, offsetY: 0,
  },
  penghu: {
    width: 90, height: 130, offsetX: -210, offsetY: 200,
  },
  kinmen: {
    width: 120, height: 60, offsetX: -195, offsetY: -110,
  },
  lienchiang: {
    width: 120, height: 120, offsetX: -195, offsetY: -220,
  },
  wuqiu: {
    width: 30, height: 30, offsetX: -150, offsetY: -125,
  },
};

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

// A composite projection for Taiwan, configured by default for 450x600.
export default () => {
  let cache;
  let cacheStream;

  // Longitude and latitude coordinates of their centers
  const mainland = geoMercator().rotate([-120.97, -23.60]); let mainlandPoint;
  const penghu = geoMercator().rotate([-119.53, -23.47]); let penghuPoint;
  const kinmen = geoMercator().rotate([-118.38, -24.44]); let kinmenPoint;
  const lienchiang = geoMercator().rotate([-120.22, -26.16]); let lienchiangPoint;
  const wuqiu = geoMercator().rotate([-119.45, -24.98]); let wuqiuPoint;

  let point;
  const pointStream = { point(x, y) { point = [x, y]; } };

  const mercatorTw = (coordinates) => {
    const x = coordinates[0];
    const y = coordinates[1];
    point = null;
    return (mainlandPoint.point(x, y), point)
      || (penghuPoint.point(x, y), point)
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

    const isInBounds = (obj) => y >= (obj.offsetY - obj.height / 2) / defaultScale
      && y < (obj.offsetY + obj.height / 2) / defaultScale
      && x >= (obj.offsetX - obj.width / 2) / defaultScale
      && x < (obj.offsetX + obj.width / 2) / defaultScale;

    if (isInBounds(geoCoordinates.wuqiu)) return wuqiu.invert(coordinates);
    if (isInBounds(geoCoordinates.kinmen)) return kinmen.invert(coordinates);
    if (isInBounds(geoCoordinates.lienchiang)) return lienchiang.invert(coordinates);
    if (isInBounds(geoCoordinates.penghu)) return penghu.invert(coordinates);

    return mainland.invert(coordinates);
  };

  // eslint-disable-next-line no-return-assign
  mercatorTw.stream = (stream) => (cache && cacheStream === stream
    ? cache
    : cache = multiplex([
      mainland.stream(cacheStream = stream),
      penghu.stream(stream),
      kinmen.stream(stream),
      lienchiang.stream(stream),
      wuqiu.stream(stream),
    ]));

  mercatorTw.precision = (...args) => {
    if (!args.length) return mainland.precision();
    mainland.precision(args[0]);
    penghu.precision(args[0]);
    kinmen.precision(args[0]);
    lienchiang.precision(args[0]);
    wuqiu.precision(args[0]);
    return reset();
  };

  mercatorTw.scale = (...args) => {
    if (!args.length) return mainland.scale();
    mainland.scale(args[0]);
    penghu.scale(args[0]);
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

    const genTranslate = (obj) => [
      x + (obj.offsetX / defaultScale) * k,
      y + (obj.offsetY / defaultScale) * k,
    ];

    const genClipExtent = (obj) => [
      [
        x - (((obj.width / 2) - obj.offsetX) / defaultScale) * k + epsilon,
        y - (((obj.height / 2) - obj.offsetY) / defaultScale) * k + epsilon,
      ],
      [
        x + (((obj.width / 2) + obj.offsetX) / defaultScale) * k - epsilon,
        y + (((obj.height / 2) + obj.offsetY) / defaultScale) * k - epsilon,
      ],
    ];

    // Takes the bbox difference between the corner and the center to
    // determine where to clip.
    mainlandPoint = mainland
      .translate(genTranslate(geoCoordinates.mainland))
      .clipExtent(genClipExtent(geoCoordinates.mainland))
      .stream(pointStream);

    penghuPoint = penghu
      .translate(genTranslate(geoCoordinates.penghu))
      .clipExtent(genClipExtent(geoCoordinates.penghu))
      .stream(pointStream);

    kinmenPoint = kinmen
      .translate(genTranslate(geoCoordinates.kinmen))
      .clipExtent(genClipExtent(geoCoordinates.kinmen))
      .stream(pointStream);

    lienchiangPoint = lienchiang
      .translate(genTranslate(geoCoordinates.lienchiang))
      .clipExtent(genClipExtent(geoCoordinates.lienchiang))
      .stream(pointStream);

    wuqiuPoint = wuqiu
      .translate(genTranslate(geoCoordinates.wuqiu))
      .clipExtent(genClipExtent(geoCoordinates.wuqiu))
      .stream(pointStream);

    return reset();
  };

  mercatorTw.fitExtent = (extent, object) => fitExtent(mercatorTw, extent, object);
  mercatorTw.fitSize = (size, object) => fitSize(mercatorTw, size, object);

  // Get the compositionBorderPoints because we want to export these
  // for use as generating geojson.
  mercatorTw.compositionBorderPoints = () => {
    const k = mainland.scale();
    const t = mainland.translate();
    const x = t[0];
    const y = t[1];

    // Points from top left to bottom left, clockwise.
    const points = (areaKey) => {
      const areaCenterX = geoCoordinates[areaKey].offsetX;
      const areaCenterY = geoCoordinates[areaKey].offsetY;
      const dx = geoCoordinates[areaKey].width / 2;
      const dy = geoCoordinates[areaKey].height / 2;
      return [
        [
          x + ((areaCenterX - dx) / defaultScale) * k,
          y + ((areaCenterY - dy) / defaultScale) * k,
        ],
        [
          x + ((areaCenterX + dx) / defaultScale) * k,
          y + ((areaCenterY - dy) / defaultScale) * k,
        ],
        [
          x + ((areaCenterX + dx) / defaultScale) * k,
          y + ((areaCenterY + dy) / defaultScale) * k,
        ],
        [
          x + ((areaCenterX - dx) / defaultScale) * k,
          y + ((areaCenterY + dy) / defaultScale) * k,
        ],
      ];
    };

    return ['penghu', 'lienchiang', 'kinmen', 'wuqiu'].map((areaKey) => {
      const areaPoints = points(areaKey);

      // Kinmen borders wrap under wuqiu borders.
      if (areaKey === 'kinmen') {
        const wuqiuPoints = points('wuqiu');
        return {
          name: areaKey,
          coords: [
            areaPoints[0], wuqiuPoints[0], wuqiuPoints[3], wuqiuPoints[2],
            areaPoints[2], areaPoints[3], areaPoints[0],
          ],
        };
      }
      return {
        name: areaKey,
        coords: [...areaPoints, areaPoints[0]],
      };
    });
  };

  // Given a context, draw the borders
  mercatorTw.drawCompositionBorders = (context) => {
    mercatorTw.compositionBorderPoints().forEach((areaBorder) => {
      areaBorder.coords.forEach((coords, i) => {
        if (i === 0) context.moveTo(...coords);
        else context.lineTo(...coords);
      });
    });
  };

  // Returns the compositionBorders as an svg path.
  mercatorTw.getCompositionBorders = () => {
    const context = path();
    mercatorTw.drawCompositionBorders(context);
    return context.toString();
  };

  return mercatorTw.scale(defaultScale).translate(defaultCenter);
};
