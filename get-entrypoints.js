// Read asseet-manifest.js from supplied path from command line arg,
// and prints MAIN_CSS and MAIN_JS values, in .env file style.
// The output can be used to define env vars

const DOMAIN = process.env.DOMAIN;
const ROOT_PATH = process.env.ROOT_PATH;

const fs = require('fs');
const myArgs = process.argv.slice(2);
const assetManifest = JSON.parse(fs.readFileSync(myArgs[0], 'utf8'));

if (!assetManifest.entrypoints) {
  throw 'No entrypoint found';
}

if (!assetManifest.entrypoints) {
  throw 'entrypoints prop not found in asset manifest';
}

if (assetManifest.entrypoints.length !== 2) {
  throw 'Unexpected entrypoint array size (expecting 2)';
}

for (const i of assetManifest.entrypoints) {
  if (i.endsWith('.css')) {
    const MAIN_CSS = `${DOMAIN}/${ROOT_PATH}/${i}`;
    console.log(`MAIN_CSS="${MAIN_CSS}"`);
  } else if (i.endsWith('.js')) {
    const MAIN_JS = `${DOMAIN}/${ROOT_PATH}/${i}`;
    console.log(`MAIN_JS="${MAIN_JS}"`);
  } else {
    throw 'Unknown entry file type';
  }
}
