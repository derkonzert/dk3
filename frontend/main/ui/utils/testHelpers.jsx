import React from "react"
import { mount } from "enzyme"
import { ThemeProvider } from "../theme"

export const mountWithTheme = elements =>
  mount(<ThemeProvider>{elements}</ThemeProvider>)
