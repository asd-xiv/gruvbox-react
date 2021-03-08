/* eslint-env node */

const path = require("path")

module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 2,
    },
    "postcss-color-function": {},
    "postcss-custom-media": {
      // when consumed and compiled by another project, not having an absolute
      // path will resolve to the folder relative to the comsuming project
      importFrom: path.resolve(__dirname, "src/variables.css"),
    },
  },
}
