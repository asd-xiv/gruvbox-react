/* eslint-disable unicorn/no-object-as-default-parameter */

const debug = require("debug")("@asd14/gruvbox-ui:useTheme:redux")

export const STORE_KEY = "GLOBAL.THEME"

export const reducer = (
  state = {
    theme: undefined,
    size: undefined,
  },
  { type, payload = {} }
) => {
  switch (type) {
    case `${STORE_KEY}.SET`:
      return {
        ...state,
        ...payload,
      }
    default:
      return state
  }
}
