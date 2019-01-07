const fs = require('fs');
const path = require('path');

const FONTAWESOME_PATH = 'node_modules/@fortawesome/fontawesome-free';
const css = fs.readFileSync(path.join(FONTAWESOME_PATH, 'css', 'all.min.css'), 'utf-8');
const inlined = css.replace(/src:url\(([^)])+\)[^;}]*[;}]/g, (m) => {
  if (m.indexOf(' ') !== -1) return m[m.length - 1];
  const filename = m.slice(8, -2).replace(/\.eot$/, '.woff');
  const data = fs.readFileSync(path.join(FONTAWESOME_PATH, 'css', filename));
  return 'src:url(data:application/font-woff;charset=utf-8;base64,' +
    data.toString('base64') +
    m[m.length - 1];
});

fs.writeFileSync('dist/fontawesome.inline.min.css', inlined);
