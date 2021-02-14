# Taiwan Atlas TopoJSON

Similar to the [topojson/us-atlas](https://github.com/topojson/us-atlas) project, this repository provides a topojson redistribution of the shapefiles provided by Taiwan's Ministry of the Interior. See [the demo](https://observablehq.com/@dkaoster/taiwan-map) for usage example.

All of these files are provided at a scale of 1:10 thousand.

## File Reference

<a href="#villages-10t.json" name="villages-10t.json">#</a> <b>villages-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/villages-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>villages</i>, <i>towns</i>, <i>counties</i>, and <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Ministry of the Interior’s [村里界圖(TWD97經緯度)](https://data.gov.tw/dataset/7438). The town boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) villages, the county boundaries by merging towns, and the nation boundary is computed by merging counties, ensuring a consistent topology.

<a href="#villages-mercator-10t.json" name="villages-mercator-10t.json">#</a> <b>villages-mercator-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/villages-mercator-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>villages</i>, <i>towns</i>, <i>counties</i>, and <i>nation</i>. The geometry is quantized, simplified, and projected with the mercatorTw projection. This topology is derived from the Ministry of the Interior’s [村里界圖(TWD97經緯度)](https://data.gov.tw/dataset/7438). The town boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) villages, the county boundaries by merging towns, and the nation boundary is computed by merging counties, ensuring a consistent topology. This file also contains a compBorders object for optionally drawing the borders of the composed areas.

<a href="#towns-10t.json" name="towns-10t.json">#</a> <b>towns-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/towns-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>towns</i>, <i>counties</i>, and <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Ministry of the Interior’s [鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441). The county boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) towns and the nation boundaries by merging counties, ensuring a consistent topology.

<a href="#towns-mercator-10t.json" name="towns-mercator-10t.json">#</a> <b>towns-mercator-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/towns-mercator-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>towns</i>, <i>counties</i>, and <i>nation</i>. The geometry is quantized, simplified, and projected with the mercatorTw projection. This topology is derived from the Ministry of the Interior’s [鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441). The county boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) towns and the nation boundaries by merging counties, ensuring a consistent topology. This file also contains a compBorders object for optionally drawing the borders of the composed areas.

<a href="#districts-10t.json" name="districts-10t.json">#</a> <b>districts-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/districts-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>districts</i> specifying legislative districts, <i>counties</i>, and <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Ministry of the Interior’s [鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441) and combined via the districts specified in [this json file](https://github.com/dkaoster/taiwan-atlas/blob/master/utils/districts.json). The county boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) districts and the nation boundaries by merging counties, ensuring a consistent topology.

<a href="#districts-mercator-10t.json" name="districts-mercator-10t.json">#</a> <b>districts-mercator-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/districts-mercator-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>districts</i> specifying legislative districts, <i>counties</i>, and <i>nation</i>. The geometry is quantized, simplified, and projected with the mercatorTw projection. This topology is derived from the Ministry of the Interior’s [鄉鎮市區界線(TWD97經緯度)](https://data.gov.tw/dataset/7441) and combined via the districts specified in [this json file](https://github.com/dkaoster/taiwan-atlas/blob/master/utils/districts.json). The county boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) districts and the nation boundaries by merging counties, ensuring a consistent topology. This file also contains a compBorders object for optionally drawing the borders of the composed areas.

<a href="#counties-10t.json" name="counties-10t.json">#</a> <b>counties-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/counties-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>counties</i>, and <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Ministry of the Interior’s [直轄市、縣市界線(TWD97經緯度)](https://data.gov.tw/dataset/7442). The nation boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) counties, ensuring a consistent topology.

<a href="#counties-mercator-10t.json" name="counties-mercator-10t.json">#</a> <b>counties-mercator-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/counties-mercator-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>counties</i> and <i>nation</i>. The geometry is quantized, simplified, and projected with the mercatorTw projection. This topology is derived from the Ministry of the Interior’s [直轄市、縣市界線(TWD97經緯度)](https://data.gov.tw/dataset/7442). The nation boundaries are computed by [merging](https://github.com/topojson/topojson-client/blob/master/README.md#merge) counties, ensuring a consistent topology. This file also contains a compBorders object for optionally drawing the borders of the composed areas.

<a href="#nation-10t.json" name="nation-10t.json">#</a> <b>nation-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/nation-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>nation</i>. The geometry is quantized and simplified, but not projected. This topology is derived from the Ministry of the Interior’s [直轄市、縣市界線(TWD97經緯度)](https://data.gov.tw/dataset/7442).

<a href="#nation-mercator-10t.json" name="nation-mercator-10t.json">#</a> <b>nation-mercator-10t.json</b> · [Download](https://cdn.jsdelivr.net/npm/taiwan-atlas/nation-mercator-10t.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) containing the geometry collections <i>nation</i>. The geometry is quantized, simplified, and projected with the mercatorTw projection. This topology is derived from the Ministry of the Interior’s [直轄市、縣市界線(TWD97經緯度)](https://data.gov.tw/dataset/7442). This file also contains a compBorders object for optionally drawing the borders of the composed areas.

<a href="#tw.objects.nation" name="tw.objects.nation">#</a> tw.objects<b>.nation</b>

<img src="https://raw.githubusercontent.com/dkaoster/taiwan-atlas/master/img/nation.png" width="50%">

The nation object has two fields:
- nation.properties.ID - "TW"
- nation.properties.NAME - "Taiwan"

<a href="#tw.objects.counties" name="tw.objects.counties">#</a> tw.objects<b>.counties</b>

<img src="https://raw.githubusercontent.com/dkaoster/taiwan-atlas/master/img/counties.png" width="50%">

The county object has the following fields:
- county.properties.COUNTYNAME - The name of the county in Chinese
- county.properties.COUNTYENG - The name of the county in English
- county.properties.COUNTYID - The character specifying id
- county.properties.COUNTYCODE - The five digit county code

<a href="#tw.objects.towns" name="tw.objects.towns">#</a> tw.objects<b>.towns</b>

<img src="https://raw.githubusercontent.com/dkaoster/taiwan-atlas/master/img/towns.png" width="50%">

The town object has the following fields in addition to the county fields:
- town.properties.TOWNNAME - The name of the county in Chinese
- town.properties.TOWNENG - The name of the county in English
- town.properties.TOWNID - The character specifying id
- town.properties.TOWNCODE - The eight digit county code

<a href="#tw.objects.districts" name="tw.objects.districts">#</a> tw.objects<b>.districts</b>

<img src="https://raw.githubusercontent.com/dkaoster/taiwan-atlas/master/img/districts.png" width="50%">

The district object has the following fields in addition to the county fields:
- district.properties.DISTRICTCODE - The eight digit county code dash (-) the district number

<a href="#tw.objects.villages" name="tw.objects.villages">#</a> tw.objects<b>.villages</b>

<img src="https://raw.githubusercontent.com/dkaoster/taiwan-atlas/master/img/villages.png" width="50%">

The village object has the following fields in addition to the town and county fields:
- village.properties.VILLNAME - The name of the village in Chinese
- village.properties.VILLENG - The name of the village in English
- village.properties.VILLID - The village specifying id
- village.properties.VILLCODE - The 11 digit county code

The compBorders object has the following fields:
- compBorders.properties.BORDERLEVEL - The administrative level that this border encompasses.
- compBorders.properties.NAME - The name in Chinese of the administrative area that this border encompasses.
- compBorders.properties.ID - The id of the administrative area that this border encompasses.
- compBorders.properties.CODE - The name of the administrative area that this border encompasses.
- compBorders.properties.ENG - The name in English of the administrative area that this border encompasses.

## MercatorTw Projection

`mercatorTw.js` uses a Taiwan-centric composite projection of four [d3.geoMercator](https://github.com/d3/d3-geo#geoMercator) projections: One for the main island, and one for each of Penghu, Kinmen, Lienchiang, and Wuqiu respectively.

`mercatorTw.getCompositionBorders()` returns a svg path string of the borders, given the current scale and translation.

This package exports the mercatorTw projection and can be used in your own projects.

```js
import mercatorTw from 'taiwan-atlas';
```

## License
MIT
