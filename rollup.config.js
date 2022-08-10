import replace from '@rollup/plugin-replace';
import external from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import html from 'rollup-plugin-generate-html-template';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/client/index.tsx',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    replace({ 'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development') }),
    external(),
    resolve({ extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    babel({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      exclude: /node_modules/,
      babelrc: false,
      babelHelpers: 'bundled',
      presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
      plugins: [],
    }),
    html({ template: 'src/client/index.html', target: 'index.html' }),
    production && terser(),
  ],
}