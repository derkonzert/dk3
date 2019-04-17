import React from "react"
import styled from "@emotion/styled"

import { inputStyles } from "./inputStyles"
import {
  InputBorder,
  InputLabel,
  InputDescription,
  InputError,
} from "./TextInput"
import { withSpacing } from "../utils/withSpacing"

export const Fill = styled.div`
  ${inputStyles}
  text-align: left;

  input[type="checkbox"] {
    margin-right: 1rem;
  }
`

export const Checkbox = withSpacing({ mb: 3 })(
  ({
    label,
    valid,
    validate,
    error,
    description,
    name,
    className,
    ...props
  }) => (
    <div className={className}>
      <InputBorder validate={validate} valid={valid}>
        <Fill>
          {(!!label || !!description) && (
            <InputLabel htmlFor={name}>
              <input type="checkbox" {...props} id={name} name={name} /> {label}
            </InputLabel>
          )}
          {!!description && <InputDescription>{description}</InputDescription>}
        </Fill>
      </InputBorder>
      {!!error && <InputError>{error}</InputError>}
    </div>
  )
)
