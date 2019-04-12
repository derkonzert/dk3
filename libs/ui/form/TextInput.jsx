import React from "react"
import styled from "@emotion/styled"

import {
  inputStyles,
  inputBorderStyles,
  validInputStyle,
  invalidInputStyle,
} from "./inputStyles"
import { withSpacing } from "../utils/withSpacing"

export const Input = styled.input`
  ${inputStyles}
`

export const InputBorder = styled.div`
  ${inputBorderStyles};
  ${({ valid, validate, ...props }) =>
    validate ? (valid ? validInputStyle(props) : invalidInputStyle(props)) : ""}
`

export const InputLabel = styled.label`
  display: flex;
  justify-content: space-between;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.35;
`

export const InputDescription = styled.span`
  margin-left: 0.3rem;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.description};
  font-style: italic;
`

export const InputError = styled.div`
  display: block;
  margin: 0.3rem 0.3rem 0;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.inputError};
`

export const TextInput = withSpacing({ mb: 3 })(
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
      {(!!label || !!description) && (
        <InputLabel htmlFor={name}>
          {label}
          {!!description && <InputDescription>{description}</InputDescription>}
        </InputLabel>
      )}
      <InputBorder validate={validate} valid={valid}>
        <Input {...props} id={name} name={name} />
      </InputBorder>
      {!!error && <InputError>{error}</InputError>}
    </div>
  )
)
