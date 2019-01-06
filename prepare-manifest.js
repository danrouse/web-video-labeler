const package = require('./package.json');
const manifest = require('./src/manifest.json');

const permissions = manifest.permissions;
if (process.env.NODE_ENV === 'development') {
  permissions.push('management');
}

const updatedManifest = {
  ...manifest,
  permissions,
  version: package.version,
  description: package.description,
  author: package.author,
  homepage_url: package.homepage,
};

require('fs').writeFileSync(
  'dist/manifest.json',
  JSON.stringify(updatedManifest, null, 2)
);
