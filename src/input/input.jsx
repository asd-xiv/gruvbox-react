/* eslint-disable unicorn/prevent-abbreviations */

const debug = require("debug")("@asd14/gruvbox-ui:Input")

import React, { forwardRef } from "react"
import PropTypes from "prop-types"
import cx from "classnames"
import cuid from "cuid"
import { isEmpty, is } from "@asd14/m"

import css from "./input.module.css"

const Input = forwardRef(
  (
    {
      className,
      id,
      placeholder,
      value,
      label,
      shadow,
      tabIndex,
      error,
      isDisabled,
      isLoading,
      hasAutocomplete,
      hasErrorMessage,
      onChange,
      onSubmit,
      onFocus,
      onBlur,
      onKeyDown,
    },
    reference
  ) => {
    const handleKeyDown = event => {
      if (event.key === "Tab" || event.key === "Escape") {
        event.preventDefault()

        if (onBlur) {
          onBlur(event)
        }
      }

      if (is(onSubmit) && event.key === "Enter") {
        onSubmit(event)
      }

      if (is(onKeyDown)) {
        onKeyDown(event)
      }
    }

    const inputId = is(id) ? id : cuid()
    const hasError = !isEmpty(error)

    /* eslint-disable react/forbid-dom-props, unicorn/no-null */
    return (
      <div
        className={cx(css.input, {
          [className]: !isEmpty(className),
          [css["input--is-disabled"]]: isDisabled || isLoading,
          [css["input--has-error"]]: hasError,
        })}>
        <React.Fragment>
          {isEmpty(label) ? null : <label htmlFor={inputId}>{label}</label>}
          {isEmpty(shadow) ? null : (
            <span className={css.shadow}>{shadow}</span>
          )}
          <input
            ref={reference}
            id={inputId}
            placeholder={placeholder}
            name={id}
            value={value}
            tabIndex={tabIndex}
            disabled={isDisabled || isLoading}
            autoComplete={hasAutocomplete ? "on" : "off"}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </React.Fragment>

        {hasError && hasErrorMessage && (
          <div className={css.error}>{error}</div>
        )}
      </div>
    )
  }
)

Input.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  shadow: PropTypes.string,
  tabIndex: PropTypes.number,
  error: PropTypes.string,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasAutocomplete: PropTypes.bool,
  hasErrorMessage: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
}

Input.defaultProps = {
  className: undefined,
  id: "",
  placeholder: undefined,
  label: undefined,
  shadow: "",
  tabIndex: undefined,
  error: undefined,
  isDisabled: false,
  isLoading: false,
  hasAutocomplete: true,
  hasErrorMessage: true,
  onSubmit: undefined,
  onFocus: undefined,
  onBlur: undefined,
  onKeyDown: undefined,
}

const memo = React.memo(Input)

export { memo as Input }
