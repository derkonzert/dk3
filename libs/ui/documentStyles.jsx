import { css } from "@emotion/core"

export const global = css`
  * {
    box-sizing: border-box;
  }
  :focus:not(:focus-visible) {
    outline: none;
  }
  html {
    background-color: #f4f2f2;
    font-size: 62.5%; /* ~10px makes using rem simple */
  }
  body {
    margin: 0;
    font-size: 1.6rem;
    font-family: IBMPlexSans-Text, sans-serif;

    -webkit-font-smoothing: antialiased;
  }

  @media screen and (min-width: 40em) {
    html {
      /* ~12px scale everything up a little */
      font-size: 75%;
    }
  }
`
