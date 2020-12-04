#!/bin/bash

topo2geo villages=- < villages-mercator-10t.json | geo2svg -o img/villages.svg -w 450 -h 600
svgexport img/villages.svg img/villages.png 2x

topo2geo towns=- < villages-mercator-10t.json | geo2svg -o img/towns.svg -w 450 -h 600
svgexport img/towns.svg img/towns.png 2x

topo2geo counties=- < villages-mercator-10t.json | geo2svg -o img/counties.svg -w 450 -h 600
svgexport img/counties.svg img/counties.png 2x

topo2geo nation=- < villages-mercator-10t.json | geo2svg -o img/nation.svg -w 450 -h 600
svgexport img/nation.svg img/nation.png 2x
