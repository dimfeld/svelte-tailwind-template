const production = !process.env.ROLLUP_WATCH;
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
    production &&
      purgecss({
        content: ['./**/*.html', './**/*.svelte'],
        defaultExtractor: (content) => {
          const regExp = new RegExp(/[A-Za-z0-9-_:/.]+/g);

          const matchedTokens = [];

          let match = regExp.exec(content);
          // To make sure that you do not lose any tailwind classes used in class directive.
          // https://github.com/tailwindcss/discuss/issues/254#issuecomment-517918397
          while (match) {
            let className = match[0].startsWith('class:')
              ? match[0].substring(6)
              : match[0];
            matchedTokens.push(className);

            match = regExp.exec(content);
          }

          return matchedTokens;
        },
      }),
    production && require('cssnano'),
  ],
};
