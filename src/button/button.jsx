const debug = require("debug")("@asd14/gruvbox-ui:Button")

import * as React from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import { is } from "@asd14/m"

import css from "./button.module.css"

const Button = ({
  className,
  label,
  icon,
  type,
  size,
  isDisabled,
  onClick,
}) => (
  <span
    className={cx(
      className,
      css.button,
      css[`button--type-${type}`],
      css[`button--size-${size}`],
      {
        [css["button--is-disabled"]]: isDisabled,
      }
    )}
    onMouseDown={isDisabled ? undefined : onClick}>
    {is(icon) && <span className={css["button-icon"]}>{icon}</span>}
    {is(label) && <span className={css["button-label"]}>{label}</span>}
  </span>
)

Button.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  type: PropTypes.oneOf(["primary", "secondary", "bad"]),
  size: PropTypes.oneOf(["normal"]),
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
}

Button.defaultProps = {
  className: "",
  icon: undefined,
  type: "primary",
  size: "normal",
  isDisabled: false,
  onClick: undefined,
}

const memo = React.memo(Button)

export { memo as Button }
