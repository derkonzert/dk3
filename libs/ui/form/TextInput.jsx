import React from "react"
import styled from "@emotion/styled"

import {
  inputStyles,
  inputBorderStyles,
  validInputStyle,
  invalidInputStyle,
} from "./inputStyles"

const Input = styled.input`
  ${inputStyles}
`

export const InputBorder = styled.div`
  ${inputBorderStyles};
  ${({ valid, validate }) =>
    validate ? (valid ? validInputStyle : invalidInputStyle) : ""}
`

export const InputLabel = styled.label`
  display: block;
  font-weight: normal;
  font-size: 1.2rem;
`

export const InputError = styled.div`
  display: block;
  margin: 0.3rem 0.3rem 0;
  font-size: 1.2rem;
  color: #d23939;
`

export const TextInput = ({ label, valid, validate, error, id, ...props }) => (
  <React.Fragment>
    {!!label && <InputLabel htmlFor={id}>{label}</InputLabel>}
    <InputBorder validate={validate} valid={valid}>
      <Input {...props} id={id} />
    </InputBorder>
    {!!error && <InputError>{error}</InputError>}
  </React.Fragment>
)
