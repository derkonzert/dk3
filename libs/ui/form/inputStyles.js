import { css } from "@emotion/core"
import { gradientBackground } from "../common"

export const inputStyles = css`
  display: block;
  width: 100%;
  margin: 0;
  padding: 0.6rem 0.8rem;

  font-family: inherit;
  font-size: 1.6rem;

  background: white;
  border: 0 solid;

  border-radius: 0.2rem;
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
  padding: 3px;
  border-radius: 0.3rem;
  background: rgba(0, 0, 0, 0.2);

  &:focus-within {
    ${gradientBackground};
  }
`
