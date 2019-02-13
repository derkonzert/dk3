import React from "react"
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming"

const defaultTheme = {
  colors: {
    black: "#000",
  },
}

export const ThemeProvider = ({ theme, ...props }) => (
  <EmotionThemeProvider theme={theme || defaultTheme} {...props} />
)
