import rollupTypescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

export default {
  input: 'lib/event.ts',
  output: {
    name: 'muti-events',
    file: 'dist/muti-events.js',
    format: 'cjs'
  },
  plugins: [
    rollupTypescript(),
    commonjs(),
    babel({
      extensions: [ 'js', 'ts' ],
      exclude: 'node_modules/**'
    }),
  ]
};