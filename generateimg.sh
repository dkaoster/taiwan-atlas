#!/bin/bash

# Create the border json
topo2geo compBorders=- < nation-mercator-10t.json > img/base-border.json

# Villages
topo2geo villages=- < villages-mercator-10t.json > img/base-villages.json
geojson-merge img/base-villages.json img/base-border.json | geo2svg -o img/villages.svg -w 450 -h 600
svgexport img/villages.svg img/villages.png 2x "path {stroke-width: 0.3px;}"

# Districts
topo2geo districts=- < districts-mercator-10t.json > img/base-districts.json
geojson-merge img/base-districts.json img/base-border.json | geo2svg -o img/districts.svg -w 450 -h 600
svgexport img/districts.svg img/districts.png 2x "path {stroke-width: 0.5px;}"

# Towns
topo2geo towns=- < towns-mercator-10t.json > img/base-towns.json
geojson-merge img/base-towns.json img/base-border.json | geo2svg -o img/towns.svg -w 450 -h 600
svgexport img/towns.svg img/towns.png 2x "path {stroke-width: 0.5px;}"

# Counties
topo2geo counties=- < counties-mercator-10t.json > img/base-counties.json
geojson-merge img/base-counties.json img/base-border.json | geo2svg -o img/counties.svg -w 450 -h 600
svgexport img/counties.svg img/counties.png 2x

# Nation
topo2geo nation=- < nation-mercator-10t.json > img/base-nation.json
geojson-merge img/base-nation.json img/base-border.json | geo2svg -o img/nation.svg -w 450 -h 600
svgexport img/nation.svg img/nation.png 2x
