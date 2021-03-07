const debug = require("debug")("@asd14/gruvbox-ui:useTheme")

import { useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"

import { STORE_KEY } from "./theme.redux"

export const useTheme = (props = {}) => {
  const dispatch = useDispatch()

  const {
    theme: defaultTheme = "gruvbox-dark",
    size: defaultSize = "normal",
  } = props

  const { theme = defaultTheme, size = defaultSize, unit } = useSelector(
    state => state[STORE_KEY]
  )

  return [
    {
      theme,
      size,
      unit,
    },
    {
      setTheme: useCallback(
        source =>
          dispatch({
            type: `${STORE_KEY}.SET`,
            payload: { theme: source },
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
