# Taiwan Atlas TopoJSON

Similar to the [topojson/us-atlas](https://github.com/topojson/us-atlas) project, this repository provides a topojson redistribution of the shapefiles provided by Taiwan's Ministry of the Interior.

All of these files are provided at a scale of 1:10 thousand.

## File Reference

<a href="#villages-10t.json" name="villages-10t.json">#</a> <b>villages-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/counties-10m.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>counties</i>, <i>states</i>, and <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Census Bureau’s [cartographic county boundaries, 2017 edition](https://www2.census.gov/geo/tiger/GENZ2017/shp/). The state boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) counties, and the nation boundary is computed by merging states, ensuring a consistent topology.


## MercatorTw Projection

`mercatorTw.js` uses a Taiwan-centric composite projection of three [d3.geoMercator](https://github.com/d3/d3-geo#geoMercator) projections: One for the main island, and one for each of Kinmen, Lienchiang, and Wuqiu respectively.

This projection is exported from this package and can be used in your own projects.

```js
import mercatorTw from 'taiwan-atlas';
```

## License
MIT
