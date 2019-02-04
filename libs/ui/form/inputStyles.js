import { css } from "@emotion/core"
import { gradientBackground } from "../common"

export const inputStyles = css`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.6rem 0.8rem;

  font-family: "IBM Plex Mono", monospace;
  font-weight: normal;
  font-size: 1.6rem;

  background: white;
  border: 0 solid;

  border-radius: 2px;
  appearance: none;

  &:focus {
    outline: none;
  }
`

export const validInputStyle = css`
  background: rgb(55, 169, 124);
`

export const invalidInputStyle = css`
  background: #d23939;
`

export const inputBorderStyles = css`
  padding: 1px;
  border-radius: 3px;
  background: hsl(0, 0%, 80%);

  &:focus-within {
    ${gradientBackground};
  }
`
