import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
const svelteConfig = require('./svelte.config');

const production = !process.env.ROLLUP_WATCH;

const babelConfig = {
  extensions: ['.js', '.mjs', '.html', '.svelte', '.ts'],
  exclude: ['node_modules/@babel/**'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { chrome: 78, firefox: 70 },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-optional-chaining',
  ],
};

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    file: 'public/bundle.js',
  },
  plugins: [
    svelte({
      preprocess: svelteConfig.preprocess,
      // enable run-time checks when not in production
      dev: !production,
      css: (css) => {
        css.write('public/components.css');
      },
    }),
    postcss({
      extract: 'public/utils.css',
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({ browser: true }),
    commonjs(),
    babel(babelConfig),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
