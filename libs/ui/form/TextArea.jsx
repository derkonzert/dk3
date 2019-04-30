import React from "react"
import styled from "@emotion/styled"

import { inputStyles } from "./inputStyles"
import {
  InputBorder,
  InputLabel,
  InputDescription,
  InputFeedback,
} from "./TextInput"
import { withSpacing } from "../utils/withSpacing"

export const Area = styled.textarea`
  ${inputStyles}
  ${({ readOnly }) => readOnly && "font-size: 1.2rem;"}
  resize: none;
`

export const TextArea = withSpacing({ mb: 3 })(
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
        <Area {...props} id={name} name={name} />
      </InputBorder>
      {!!error && <InputFeedback error>{error}</InputFeedback>}
    </div>
  )
)
