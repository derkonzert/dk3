import React from "react"
import styled from "@emotion/styled"

import { inputStyles } from "./inputStyles"
import { InputLabel, InputDescription, InputFeedback } from "./TextInput"
import { withSpacing } from "../utils/withSpacing"

export const Fill = styled.div`
  ${inputStyles}
  padding-left: 0;
  text-align: left;
  background: transparent;

  input[type="checkbox"] {
    margin-right: 0.8rem;
    margin-top: 0.4rem;
    flex: 0 0 auto;
  }
`

export const Label = styled.span`
  flex: 1 1 auto;
`

export const Checkbox = withSpacing({ mv: "m" })(
  ({ label, error, description, name, className, checked, ...props }) => (
    <div className={className}>
      <Fill>
        {(!!label || !!description) && (
          <InputLabel htmlFor={name}>
            <input
              checked={checked}
              type="checkbox"
              {...props}
              id={name}
              name={name}
            />
            <Label>{label}</Label>
          </InputLabel>
        )}
        {!!description && <InputDescription>{description}</InputDescription>}
      </Fill>

      {!!error && <InputFeedback error>{error}</InputFeedback>}
    </div>
  )
)
