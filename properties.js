const shapefile = require('shapefile');
const globby = require('globby');

// Parse the piped in topojson
function parseInput() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => {
        try { resolve(JSON.parse(chunks.join(''))); } catch (error) { reject(error); }
      })
      .setEncoding('utf8');
  });
}

// 臺 > 台
function fixTai(obj) {
  return { ...obj, COUNTYNAME: obj.COUNTYNAME.replace('臺', '台') };
}

// Generated modified properties
function output([topology, towns, counties]) {
  const townsMap = new Map(
    towns.features.map((d) => [d.properties.TOWNCODE, d.properties]),
  );
  const countiesMap = new Map(
    counties.features.map((d) => [d.properties.COUNTYCODE, d.properties]),
  );

  // Process village properties
  if (topology.objects.villages) {
    // eslint-disable-next-line no-restricted-syntax
    for (const village of topology.objects.villages.geometries) {
      village.properties = fixTai(village.properties);
      village.properties.TOWNENG = townsMap.get(village.properties.TOWNCODE).TOWNENG;
      village.properties.COUNTYENG = countiesMap.get(village.properties.COUNTYCODE).COUNTYENG;
      delete village.properties.NOTE;
    }
  }

  // Process town properties
  if (topology.objects.towns) {
    // eslint-disable-next-line no-restricted-syntax
    for (const town of topology.objects.towns.geometries) {
      town.properties = fixTai(town.properties);
      town.properties.TOWNENG = townsMap.get(town.properties.TOWNCODE).TOWNENG;
      town.properties.COUNTYENG = countiesMap.get(town.properties.COUNTYCODE).COUNTYENG;
      delete town.properties.NOTE;
    }
  }

  // Process county properties
  if (topology.objects.counties) {
    // eslint-disable-next-line no-restricted-syntax
    for (const county of topology.objects.counties.geometries) {
      county.properties = fixTai(county.properties);
      county.properties.COUNTYENG = countiesMap.get(county.properties.COUNTYCODE).COUNTYENG;
      delete county.properties.NOTE;
    }
  }

  // Add nation properties
  if (topology.objects.nation.geometries) {
    topology.objects.nation.geometries[0].properties = { ID: 'TW', NAME: 'Taiwan' };
  }

  process.stdout.write(JSON.stringify(topology));
  process.stdout.write('\n');
}

// Read the data out of the shp files.
Promise.all([
  globby('build/TOWN*.shp'),
  globby('build/COUNTY*.shp'),
]).then(([townShp, countyShp]) => Promise.all([
  parseInput(),
  shapefile.read(townShp[0]),
  shapefile.read(countyShp[0]),
]).then(output));
