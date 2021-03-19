const debug = require("debug")("@asd14/gruvbox-ui:useTheme")

import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"

import { STORE_KEY } from "./theme.redux"

const colorSchemes = {
  "gruvbox-dark": {
    fg: "#EBDBB2",
    fg4: "#A89984",
    bg: "#282828",
    bg1: "#3C3836",
    bg2: "#504945",
    bg3: "#665C54",
    bg4: "#7C6F64",
    gray: "#A89984",
    red: "#CC241D",
    green: "#98971A",
    yellow: "#D79921",
    blue: "#458588",
    blue2: "#83A598",
    purple: "#B16286",
    aqua: "#689D6A",
    orange: "#D65D0E",
    orange2: "#FE8019",
  },
}

const sizes = {
  normal: {
    unit: 16,
    radius: 3,
    fontSize: 14,
    boxShadow: "5px 5px 0 var(--color-fg4)",
    distancer: 16,
    lineHeight: 16,
  },
}

export const useTheme = (props = {}) => {
  const dispatch = useDispatch()

  const {
    colorScheme: defaultColorScheme = "color-scheme-gruvbox-dark",
    size: defaultSize = "size-normal",
  } = props

  const { colorScheme = defaultColorScheme, size = defaultSize } = useSelector(
    state => state[STORE_KEY]
  )

  return [
    {
      colorScheme,
      size,
      ...colorSchemes[colorScheme],
      ...sizes[size],
    },
    {
      setTheme: useCallback(
        source =>
          dispatch({
            type: `${STORE_KEY}.SET`,
            payload: { colorScheme: source },
          }),
        [dispatch]
      ),

      setSize: useCallback(
        source =>
          dispatch({
            type: `${STORE_KEY}.SET`,
            payload: { size: source },
          }),
        [dispatch]
      ),
    },
  ]
}
