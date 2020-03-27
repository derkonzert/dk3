import { css } from "@emotion/core"
import { gradientBackground } from "../common"

export const inputStyles = ({ theme }) => css`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.7rem 0.9rem;

  font-family: "IBM Plex Mono", monospace;
  font-weight: normal;
  font-size: 1.4rem;

  color: ${theme.colors.input};
  background: ${theme.colors.inputBackground};
  border: 0 solid;

  border-radius: 2px;
  appearance: none;

  &:focus {
    outline: none;
    box-shadow: 0 0.1rem 0.6rem rgba(0, 0, 0, 0.36);
  }

  &:disabled {
    opacity: 0.5;
  }
`

export const validInputStyle = ({ theme }) => css`
  background: ${theme.colors.inputValidBackground};
`

export const invalidInputStyle = ({ theme }) => css`
  background: ${theme.colors.inputInvalidBackground};
`

export const inputBorderStyles = ({ theme }) => css`
  padding: 2px;
  border-radius: 3px;
  background: ${theme.colors.inputBorderColor};

  &:focus-within {
    ${gradientBackground({ theme })};
  }
`
