import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-alias';
import hasha from 'hasha';
import fs from 'fs';
import path from 'path';

export default {
  input: 'dist/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': '"production"'
    }),
    alias({
      jszip: path.join(__dirname, './node_modules/jszip/dist/jszip.js')
    }),
    resolve({ web: true }),
    css({ output: 'dist/bundle.css' }),
    cjs({
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render']
      }
    }),
    {
      name: 'hash',
      onwrite: function(bundle, data) {
        const hash = hasha(data.code);
        fs.writeFileSync('.rollup-hash', hash);
      }
    }
  ]
}
