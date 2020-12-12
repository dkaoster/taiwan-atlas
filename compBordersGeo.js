// eslint-disable-next-line import/no-unresolved
const mercatorTw = require('./mercatorTw.cjs.js');

// Initialize Projection
let merc = mercatorTw();

// Read center from first argument or from defaultCenter
const translate = process.argv[2] && JSON.parse(process.argv[2]);
if (translate) merc = merc.translate(translate);

// Read scale from second argument or from defaultScale
const scale = process.argv[3] && parseInt(process.argv[3], 10);
if (scale) merc = merc.scale(scale);

// The properties that we will add to the box
const properties = {
  lienchiang: {
    BORDERLEVEL: 'COUNTY', NAME: '連江縣', ID: 'Z', CODE: '09007', ENG: 'Lienchiang County',
  },
  penghu: {
    BORDERLEVEL: 'COUNTY', NAME: '澎湖縣', ID: 'X', CODE: '10016', ENG: 'Penghu County',
  },
  kinmen: {
    BORDERLEVEL: 'COUNTY', NAME: '金門縣', ID: 'W', CODE: '09020', ENG: 'Kinmen County',
  },
  wuqiu: {
    BORDERLEVEL: 'TOWN', NAME: '烏坵鄉', ID: 'W06', CODE: '09020060', ENG: 'Wuqiu Township',
  },
};

// Generate the features
const features = merc.compositionBorderPoints()
  .map((border) => ({
    type: 'Feature',
    geometry: { type: 'Polygon', coordinates: [border.coords] },
    properties: properties[border.name],
  }));

// Print to stdout
features.forEach((feature) => {
  process.stdout.write(JSON.stringify(feature));
  process.stdout.write('\n');
});
