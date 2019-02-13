import React from "react"
import { Global } from "@emotion/core"
import { global } from "../documentStyles"
import { ThemeProvider } from "../theme"

export default function Wrapper({ children }) {
  return (
    <ThemeProvider>
      <Global styles={global} />
      {children}
    </ThemeProvider>
  )
}
