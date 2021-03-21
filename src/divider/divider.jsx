const debug = require("debug")("@asd14/gruvbox-ui:Divider")

import * as React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import css from "./divider.module.css"

const Divider = ({ className, isFancy }) => {
  return (
    <div
      className={cx(className, css.divider, {
        [css["divider--is-fancy"]]: isFancy,
      })}>
      {isFancy ? "***" : <>&nbsp;</>}
    </div>
  )
}

Divider.propTypes = {
  className: PropTypes.string,
  isFancy: PropTypes.bool,
}

Divider.defaultProps = {
  className: undefined,
  isFancy: false,
}

const memo = React.memo(Divider)

export { memo as Divider }
