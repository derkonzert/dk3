import React from "react"
import styled from "@emotion/styled"

import {
  inputStyles,
  inputBorderStyles,
  validInputStyle,
  invalidInputStyle,
} from "./inputStyles"
import { withSpacing } from "../utils/withSpacing"
import { Spinner } from "../atoms/Spinner"

export const Input = styled.input`
  ${inputStyles}
`

export const InputBorder = styled.div`
  position: relative;
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

export const InputDescription = withSpacing()(styled.div`
  margin-left: 0.3rem;
  font-size: 1.2rem;
  line-height: 1.4;
  text-align: left;
  color: ${({ theme }) => theme.colors.description};
  font-style: italic;

  a {
    color: inherit;
  }
`)

export const InputSpinner = styled(Spinner)`
  position: absolute;
  right: 0;
  top: 0;

  width: auto;
  padding: 0.4rem;
  transform: scale(0.5);
`

export const InputFeedback = styled.div`
  display: block;
  margin: 0.3rem 0.3rem 0;
  font-size: 1.2rem;
  line-height: 1.4;
  text-align: left;
  color: ${({ theme, isError }) =>
    isError ? theme.colors.inputError : theme.colors.inputSuccess};
`

export const TextInput = withSpacing({ mb: "m" })(
  React.forwardRef(
    (
      {
        label,
        valid,
        validate,
        error,
        success,
        description,
        name,
        className,
        withSpinner,
        ...props
      },
      ref
    ) => (
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
          <Input ref={ref} {...props} id={name} name={name} />
          {withSpinner && <InputSpinner />}
        </InputBorder>
        {(error || success) && (
          <InputFeedback isError={!!error}>{error || success}</InputFeedback>
        )}
      </div>
    )
  )
)
