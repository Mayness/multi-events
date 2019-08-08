import rollupTypescript from 'rollup-plugin-typescript2';
import buble from 'rollup-plugin-buble';

export default {
  input: 'lib/event.ts',
  output: {
    name: 'muti-events',
    file: 'dist/muti-events.js',
    format: 'cjs'
  },
  plugins: [
    rollupTypescript(),
    buble({
      transforms: { forOf: false }
    }),
  ]
};