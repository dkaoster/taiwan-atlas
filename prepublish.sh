#!/bin/bash

rm -rvf *-10t.json base.json
mkdir -p build

# Crawl the data pages for the download links
# Village URL
villageShpUrl=$(curl -Ls https://data.gov.tw/dataset/7438 | \
  # Find the link that has the SHP tag
  grep -io '<a[^<]*SHP</a>' | \
  # get the href tag
  sed -r 's/.*href="([^"]+).*/\1/g')

# Download and extract the archives
if [ ! -f build/*.shp ]; then
  curl -Lo build/village.zip "${villageShpUrl}"
  unzip -od build build/village.zip
fi

###############################################################################
# Generate topojson files

# Boundaries for everything we care about
bbox=117.663,21.577,122.885,26.671

# Village file
geo2topo -q 1e10 -n villages=<( \
    shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
      | ndjson-filter '!!d.properties.VILLNAME' \
      | ndjson-map '(delete d.properties.NOTE, d)') \
  | topomerge towns=villages -k 'd.properties.TOWNCODE' \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-10 \
  > base.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i base.json -clip bbox=${bbox} -filter-slivers -o format=topojson villages-10t.json

# Use mapshaper to remove layers of detail we don't want for towns
mapshaper -i villages-10t.json -drop target=villages -o format=topojson target=* towns-10t.json

# Use mapshaper to remove layers of detail we don't want for counties
mapshaper -i villages-10t.json -drop target=towns,villages -o format=topojson target=* counties-10t.json

# Use mapshaper to remove layers of detail we don't want for nation
mapshaper -i villages-10t.json -drop target=towns,villages,counties -o format=topojson target=* nation-10t.json

# Generate mercator projections
geo2topo -q 1e7 -n villages=<( \
    shp2json -n --encoding=UTF-8 build/VILLAGE*.shp \
      | ndjson-filter '!!d.properties.VILLNAME' \
      | ndjson-map '(delete d.properties.NOTE, d)' \
      | geoproject --require mercatorTw='./mercatorTw.cjs' -n 'mercatorTw()') \
  | topomerge towns=villages -k 'd.properties.TOWNCODE' \
  | topomerge counties=towns -k 'd.properties.COUNTYCODE' \
  | topomerge nation=counties \
  | toposimplify -f -s 1e-7 \
  > base-mercator.json

# Use mapshaper to remove extra slivers and islands outside of the boundaries.
mapshaper -i base-mercator.json -filter-slivers -o format=topojson villages-mercator-10t.json

# Use mapshaper to remove layers of detail we don't want for towns
mapshaper -i villages-mercator-10t.json -drop target=villages -o format=topojson target=* towns-mercator-10t.json

# Use mapshaper to remove layers of detail we don't want for counties
mapshaper -i villages-mercator-10t.json -drop target=towns,villages -o format=topojson target=* counties-mercator-10t.json

# Use mapshaper to remove layers of detail we don't want for nation
mapshaper -i villages-mercator-10t.json -drop target=towns,villages,counties -o format=topojson target=* nation-mercator-10t.json