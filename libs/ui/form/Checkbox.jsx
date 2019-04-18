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
    flex: 0 0 auto;
  }
`

export const Label = styled.span`
  flex: 1 1 auto;
`

export const Checkbox = withSpacing({ mb: 3 })(
  ({ label, error, description, name, className, checked, ...props }) => (
    <div className={className}>
      <InputBorder>
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
      </InputBorder>
      {!!error && <InputError>{error}</InputError>}
    </div>
  )
)
