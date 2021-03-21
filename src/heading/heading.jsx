const debug = require("debug")("@asd14/gruvbox-ui:Heading")

import * as React from "react"
import PropTypes from "prop-types"
import cx from "classnames"

import css from "./heading.module.css"

const Heading = ({ className, children, type }) => {
  const HeadingType = type

  return (
    <HeadingType
      className={cx(className, css.heading, css[`heading--type-${type}`])}>
      <span className={css.number}>
        {type === "h1" ? "#" : type === "h2" ? "##" : "###"}
      </span>{" "}
      {children}
    </HeadingType>
  )
}

Heading.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.oneOf(["h1", "h2", "h3"]),
}

Heading.defaultProps = {
  className: "",
  children: undefined,
  type: "h1",
}

const memo = React.memo(Heading)

export { memo as Heading }
