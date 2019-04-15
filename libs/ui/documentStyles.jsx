import { css } from "@emotion/core"

export const global = theme => css`
  /* TODO: Reduce used font variants */
  @import url("https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,600|IBM+Plex+Sans+Condensed:700|IBM+Plex+Sans:400,600|IBM+Plex+Serif:400,700");

  /*
  font-family: 'IBM Plex Mono', monospace;
  font-family: 'IBM Plex Sans', sans-serif;
  font-family: 'IBM Plex Serif', serif;
  font-family: 'IBM Plex Sans Condensed', sans-serif;
  */
  * {
    box-sizing: border-box;
  }
  :focus:not(:focus-visible) {
    outline: none;
  }
  html {
    background-color: ${theme.colors.siteBackground};
    color: ${theme.colors.siteColor};
    font-size: 62.5%; /* ~10px makes using rem simple */
  }
  body {
    margin: 0;
    font-size: 1.6rem;
    font-family: "IBM Plex Sans", sans-serif;

    -webkit-font-smoothing: antialiased;
  }

  /* ~720px*/
  @media screen and (min-width: 45em) {
    html {
      /* ~12px scale everything up a little */
      font-size: 75%;
    }
  }

  /* ~1280px*/
  @media screen and (min-width: 80em) {
    html {
      /* ~14px scale everything up a little */
      font-size: 90%;
    }
  }
`
