/* eslint-env node */

const path = require("path")

module.exports = {
  plugins: {
    "postcss-preset-env": {
      stage: 2,
    },
    "postcss-color-function": {},
    "postcss-custom-media": {
      importFrom: path.resolve(__dirname, "src/variables.css"),
    },
  },
}
