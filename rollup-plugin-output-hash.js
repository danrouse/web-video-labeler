import hasha from 'hasha';
import fs from 'fs';

export default function hash(file, otherFiles = []) {
  return {
    name: 'hash',
    generateBundle: function(options, bundle, isWrite) {
      let content = '';
      for (const f of otherFiles) content += fs.readFileSync(f);
      for (const f of Object.values(bundle)) content += f.code;
      fs.writeFileSync(file, hasha(content));
    }
  };
}
