import resolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import hash from 'rollup-plugin-bundle-hash';
import fs from 'fs';

const OUTPUT_CSS_PATH = 'dist/bundle.css';

export default {
  external: ['aws-sdk'],
  input: 'dist/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    sourcemap: true,
    globals: { 'aws-sdk': 'AWS' },
    banner: fs.readFileSync(__dirname + '/node_modules/aws-sdk/dist/aws-sdk.min.js', 'utf-8'),
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    resolve({ browser: true, preferBuiltins: false }),
    css({ output: OUTPUT_CSS_PATH }),
    cjs({
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement'],
        'node_modules/react-dom/index.js': ['render', 'createPortal'],
      }
    }),
    hash('dist/.rollup-hash', [OUTPUT_CSS_PATH])
  ]
}
