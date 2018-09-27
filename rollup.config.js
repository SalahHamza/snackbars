// Rollup plugins
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

export default {
  input: 'src/js/main.js',
  output: {
    name: 'snackbars',
    file: 'lib/index.js',
    format: 'es'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    postcss({
      plugins: [
        // auto prefix css code
        autoprefixer(),
      ],
      // Extract CSS to the same location where JS
      // file is generated.
      extract: 'lib/snackbar.css',
    })
  ]
};