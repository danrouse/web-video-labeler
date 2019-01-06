import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import alias from 'rollup-plugin-alias';
import hash from 'rollup-plugin-bundle-hash';
import path from 'path';

const OUTPUT_CSS_PATH = 'dist/bundle.css';

export default {
  input: 'dist/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'cjs',
    sourcemap: true
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    alias({
      jszip: path.join(__dirname, './node_modules/jszip/dist/jszip.js')
    }),
    resolve({ web: true, browser: true }),
    css({ output: OUTPUT_CSS_PATH }),
    cjs({
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render', 'createPortal']
      }
    }),
    hash('dist/.rollup-hash', [OUTPUT_CSS_PATH])
  ]
}
