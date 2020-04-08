import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from 'rollup-plugin-babel';
import livereload from 'rollup-plugin-livereload';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import html, { makeHtmlAttributes } from '@rollup/plugin-html';
import * as fs from 'fs';
import * as _ from 'lodash';

const production = !process.env.ROLLUP_WATCH;

const dedupe = (importee) =>
  importee === 'svelte' || importee.startsWith('svelte/');

const babelConfig = {
  extensions: ['.js', '.mjs', '.html', '.svelte', '.ts'],
  exclude: ['node_modules/@babel/**', 'data/**', 'public/**'],
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { esmodules: true },
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
    dir: 'build',
    entryFileNames: '[name].[hash].js',
    chunkFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
    sourcemap: production ? true : 'inline',
    format: 'esm',
  },
  plugins: [
    svelte({
      preprocess: require('./svelte.config').preprocess,
      // enable run-time checks when not in production
      dev: !production,
      emitCss: true,
    }),
    postcss({
      extract: true,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      extensions: ['.mjs', '.js', '.json', '.ts', '.svelte'],
      dedupe,
    }),
    copy({
      targets: [{ src: 'static/**/*', dest: 'build/' }],
    }),
    commonjs(),
    json(),
    babel(babelConfig),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    !production && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    html({
      title: 'A Svelte Website',
      template: ({ attributes, files, publicPath, title }) => {
        let templateFile = fs.readFileSync('src/index.html');

        // This is adapted from the default template function in the HTML plugin.
        const scripts = (files.js || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.script);
            return `<script src="${publicPath}${fileName}"${attrs}></script>`;
          })
          .join('\n');

        const links = (files.css || [])
          .map(({ fileName }) => {
            const attrs = makeHtmlAttributes(attributes.link);
            return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
          })
          .join('\n');

        let exec = _.template(templateFile.toString());
        return exec({
          attributes,
          title,
          scripts,
          links,
          htmlAttributes: makeHtmlAttributes(attributes.html),
        });
      },
    }),
  ],
  watch: {
    clearScreen: false,
  },
};
