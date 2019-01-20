import { css } from "@emotion/core"

export const global = css`
  * {
    box-sizing: border-box;
  }
  :focus:not(:focus-visible) {
    outline: none;
  }
  html {
    font-size: 62.5%; /* ~10px makes using rem simple */
  }
  body {
    margin: 0;
    font-size: 1.6rem;
    font-family: IBMPlexSans-Text, sans-serif;
  }

  @media screen and (min-width: 40em) {
    html {
      font-size: 87.5%; /* ~14px scale everything up a little */
    }
  }
`
