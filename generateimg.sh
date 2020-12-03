#!/bin/bash

topo2geo villages=- < villages-mercator-10t.json | geo2svg -o img/villages.svg -w 450 -h 600

topo2geo towns=- < villages-mercator-10t.json | geo2svg -o img/towns.svg -w 450 -h 600

topo2geo counties=- < villages-mercator-10t.json | geo2svg -o img/counties.svg -w 450 -h 600

topo2geo nation=- < villages-mercator-10t.json | geo2svg -o img/nation.svg -w 450 -h 600
