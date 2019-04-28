import React from "react"

import AsyncCreatableSelect from "react-select/lib/AsyncCreatable"
import { withSpacing } from "../utils/withSpacing"
import {
  InputLabel,
  InputDescription,
  InputBorder,
  InputError,
} from "./TextInput"

const alwaysHidden = () => ({
  display: "none",
})

const customStyles = {
  option: provided => ({
    ...provided,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono",
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    background: "white",
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono",
  }),
  input: provided => ({
    ...provided,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono, monospace",
  }),
  singleValue: provided => {
    return {
      ...provided,
      fontSize: "inherit",
      fontFamily: "IBM Plex Mono",
    }
  },
  loadingIndicator: alwaysHidden,
  dropdownIndicator: alwaysHidden,
  indicatorSeparator: alwaysHidden,
}

export const AutoComplete = withSpacing({ mb: 3 })(
  ({
    label,
    valid,
    validate,
    error,
    description,
    name,
    className,
    loadOptions,
    ...props
  }) => (
    <div className={className}>
      {(!!label || !!description) && (
        <InputLabel htmlFor={name}>
          {label}
          {!!description && <InputDescription>{description}</InputDescription>}
        </InputLabel>
      )}
      <InputBorder validate={validate} valid={valid}>
        <AsyncCreatableSelect
          cacheOptions
          defaultOptions
          styles={customStyles}
          inputId={name}
          loadOptions={loadOptions}
          {...props}
        />
      </InputBorder>
      {!!error && <InputError>{error}</InputError>}
    </div>
  )
)
