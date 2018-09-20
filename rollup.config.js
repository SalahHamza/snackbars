// Rollup plugins
import babel from 'rollup-plugin-babel';
import { uglify } from "rollup-plugin-uglify";

export default {
  input: 'src/js/main.js',
  output: {
    name: 'snackbars',
    file: 'lib/main.min.js',
    format: 'cjs'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    uglify()
  ],
};