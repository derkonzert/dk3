import React from "react"
import { withTheme } from "emotion-theming"
import { rgba } from "@dk3/ui/theme/rgba"
import AsyncCreatableSelect from "react-select/async-creatable"
import { withSpacing } from "../utils/withSpacing"
import {
  InputLabel,
  InputDescription,
  InputBorder,
  InputFeedback,
} from "./TextInput"

const alwaysHidden = () => ({
  display: "none",
})

const customStyles = theme => ({
  menuList: provided => ({
    ...provided,
    background: theme.colors.inputBackground,
  }),
  option: (provided, state) => ({
    ...provided,
    background:
      state.isFocused || state.isSelected
        ? rgba(theme.colors.input, 20)
        : theme.colors.inputBackground,
    color: theme.colors.input,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono",
  }),
  control: () => ({
    // none of react-select's styles are passed to <Control />
    background: theme.colors.inputBackground,
    color: theme.colors.input,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono",
  }),
  input: provided => ({
    ...provided,
    color: theme.colors.input,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono, monospace",
  }),
  singleValue: provided => ({
    ...provided,
    color: theme.colors.input,
    fontSize: "inherit",
    fontFamily: "IBM Plex Mono",
  }),
  loadingIndicator: alwaysHidden,
  dropdownIndicator: alwaysHidden,
  indicatorSeparator: alwaysHidden,
})

export const AutoComplete = withSpacing({ mb: 3 })(
  withTheme(
    ({
      theme,
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
            {!!description && (
              <InputDescription>{description}</InputDescription>
            )}
          </InputLabel>
        )}
        <InputBorder validate={validate} valid={valid}>
          <AsyncCreatableSelect
            cacheOptions
            defaultOptions
            styles={customStyles(theme)}
            inputId={name}
            loadOptions={loadOptions}
            {...props}
          />
        </InputBorder>
        {!!error && <InputFeedback error>{error}</InputFeedback>}
      </div>
    )
  )
)
