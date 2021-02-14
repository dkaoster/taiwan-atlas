#!/bin/bash

rm -rvf *-10t.json base.json
mkdir -p build

# Crawl the data pages for the download links
# Village URL
villageShpUrl=$(curl -Ls https://data.gov.tw/dataset/7438 | \
  # Find the link that has the SHP tag
  grep -io '"SHP","contentUrl":[^}]*"}' | \
  # get the href tag
  sed -E 's/.*contentUrl":"([^"]+).*/\1/g')

# Town URL
townShpUrl=$(curl -Ls https://data.gov.tw/dataset/7441 | \
  # Find the link that has the SHP tag
  grep -io '"SHP","contentUrl":[^}]*"}' | \
  # get the href tag
  sed -E 's/.*contentUrl":"([^"]+).*/\1/g')

# County URL
countyShpUrl=$(curl -Ls https://data.gov.tw/dataset/7442 | \
  # Find the link that has the SHP tag
  grep -io '"SHP","contentUrl":[^}]*"}' | \
  # get the href tag
  sed -E 's/.*contentUrl":"([^"]+).*/\1/g')

# Download and extract the archives
if [ ! -f build/village.zip ]; then
  curl -Lo build/village.zip "${villageShpUrl}"
  unzip -od build build/village.zip
fi

# Download and extract the archives
if [ ! -f build/town.zip ]; then
  curl -Lo build/town.zip "${townShpUrl}"
  unzip -od build build/town.zip
fi

# Download and extract the archives
if [ ! -f build/county.zip ]; then
  curl -Lo build/county.zip "${countyShpUrl}"
  unzip -od build build/county.zip
fi

###############################################################################
# Generate topojson files

# Boundaries for everything we care about
bbox=117.663,21.577,122.0202,26.671

# Village file
geo2topo -q 1e10 -n villages=<( \
    shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
      | ndjson-filter '!!d.properties.VILLNAME') \
  | topomerge towns=villages -k 'd.properties.TOWNCODE' \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-10 \
  | node ./properties.js \
  > villages-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i villages-10t.json -clip bbox=${bbox} -filter-slivers -o force format=topojson villages-10t.json
mapshaper -i villages-10t.json -clean target=* -o force format=topojson villages-10t.json

# Town file
geo2topo -q 1e10 -n towns=<( \
    shp2json -n --encoding=UTF-8 build/TOWN*.shp \
      | ndjson-filter '!!d.properties.TOWNNAME') \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-10 \
  | node ./properties.js \
  > towns-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i towns-10t.json -clip bbox=${bbox} -filter-slivers -o force format=topojson towns-10t.json
mapshaper -i towns-10t.json -clean target=* -o force format=topojson towns-10t.json

# County file
geo2topo -q 1e10 -n counties=<( \
    shp2json -n --encoding=UTF-8 build/COUNTY*.shp \
      | ndjson-filter '!!d.properties.COUNTYNAME') \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-10 \
  | node ./properties.js \
  > counties-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i counties-10t.json -clip bbox=${bbox} -filter-slivers -o force format=topojson counties-10t.json
mapshaper -i counties-10t.json -clean target=* -o force format=topojson counties-10t.json

# Use mapshaper to remove layers of detail we don't want for nation
mapshaper -i counties-10t.json -drop target=counties -o format=topojson target=* nation-10t.json

# District file
geo2topo -q 1e10 -n villages=<( \
    shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
      | ndjson-filter '!!d.properties.VILLNAME') \
  | DISTRICTS="true" node ./properties.js \
  | topomerge districts=villages -k 'd.properties.DISTRICTCODE' \
  | topomerge counties=districts -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-10 \
  > districts-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i districts-10t.json -clip bbox=${bbox} -filter-slivers -o force format=topojson districts-10t.json
mapshaper -i districts-10t.json -clean target=* -o force format=topojson districts-10t.json

# Use mapshaper to remove layers of detail we don't want for district
mapshaper -i districts-10t.json -drop target=villages -o force format=topojson target=* districts-10t.json

# Village mercator projections
geo2topo -q 1e7 -n \
  villages=<(shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
    | ndjson-filter '!!d.properties.VILLNAME' \
    | geoproject --require mercatorTw='./mercatorTw.cjs' -n 'mercatorTw()') \
  compBorders=<(node compBordersGeo.js) \
  | topomerge towns=villages -k 'd.properties.TOWNCODE' \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-6 \
  | node ./properties.js \
  > villages-mercator-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i villages-mercator-10t.json -filter-slivers -o force format=topojson villages-mercator-10t.json
mapshaper -i villages-mercator-10t.json -clean target=* -o force format=topojson villages-mercator-10t.json

# Town mercator projections
geo2topo -q 1e7 -n \
  towns=<(shp2json -n --encoding=UTF-8 build/TOWN*.shp \
    | ndjson-filter '!!d.properties.TOWNNAME' \
    | geoproject --require mercatorTw='./mercatorTw.cjs' -n 'mercatorTw()') \
  compBorders=<(node compBordersGeo.js) \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-6 \
  | node ./properties.js \
  > towns-mercator-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i towns-mercator-10t.json -filter-slivers -o force format=topojson towns-mercator-10t.json
mapshaper -i towns-mercator-10t.json -clean target=* -o force format=topojson towns-mercator-10t.json

# County mercator projections
geo2topo -q 1e7 -n \
  counties=<(shp2json -n --encoding=UTF-8 build/COUNTY*.shp \
    | ndjson-filter '!!d.properties.COUNTYNAME' \
    | geoproject --require mercatorTw='./mercatorTw.cjs' -n 'mercatorTw()') \
  compBorders=<(node compBordersGeo.js) \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-6 \
  | node ./properties.js \
  > counties-mercator-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i counties-mercator-10t.json -filter-slivers -o force format=topojson counties-mercator-10t.json
mapshaper -i counties-mercator-10t.json -clean target=* -o force format=topojson counties-mercator-10t.json

# Use mapshaper to remove layers of detail we don't want for nation
mapshaper -i counties-mercator-10t.json -drop target=counties -o format=topojson target=* nation-mercator-10t.json

# District mercator projections
geo2topo -q 1e7 -n \
  villages=<(shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
    | ndjson-filter '!!d.properties.VILLNAME' \
    | geoproject --require mercatorTw='./mercatorTw.cjs' -n 'mercatorTw()') \
  compBorders=<(node compBordersGeo.js) \
  | DISTRICTS="true" node ./properties.js \
  | topomerge districts=villages -k 'd.properties.DISTRICTCODE' \
  | topomerge counties=districts -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-6 \
  > districts-mercator-10t.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i districts-mercator-10t.json -filter-slivers -o force format=topojson districts-mercator-10t.json
mapshaper -i districts-mercator-10t.json -clean target=* -o force format=topojson districts-mercator-10t.json

# Use mapshaper to remove layers of detail we don't want for district
mapshaper -i districts-mercator-10t.json -drop target=villages -o force format=topojson target=* districts-mercator-10t.json
