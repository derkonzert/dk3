import React from "react"
import { ThemeProvider as EmotionThemeProvider } from "emotion-theming"

const defaultTheme = {
  name: "light",
  colors: {
    black: "#000",
    siteColor: "#3f3f3f",
    siteBackground: "#f4f2f2",
    detailBackground: "#fff",
    overlay: "rgba(190, 190, 190, 0)",
    overlayActive: "rgba(190, 190, 190, 0.65)",

    title: "#000",
    titleInverted: "white",
    text: "#3f3f3f",
    textInverted: "#f9f9f9",
    description: "#636161",
    descriptionInverted: "#f9f9f9",
    link: "#000",
    linkInverted: "#fff",
    linkHover: "#333",
    linkHoverInverted: "#eee",

    redBadge: "rgb(228, 17, 17)",
    greenBadge: "rgb(13, 132, 46)",

    boxBackground: "#fff",

    mainGradientFrom: "rgb(255, 87, 87)",
    mainGradientTo: "#6a32cc",

    dialogContentBackground: "white",
    dialogOverlayBackground: "rgba(220, 220, 220, 0.65)",

    horizontalMenuColor: "#636161",
    hr: "#e2e2e2",

    buttonColor: "black",
    buttonBorder: "rgba(0, 0, 0, 0.15)",
    buttonBorderHover: "rgba(0, 0, 0, 0.35)",
    buttonBackgroundActive: "rgba(0, 0, 0, 0.05)",
    fancyButtonColor: "black",
    fancyButtonBackground: "white",
    veryFancyButtonColor: "white",

    deleteButtonColor: "#a90505",

    stickyListTitleBackground: "rgba(244, 242, 242, 0.95)",

    inputError: "#d23939",
    input: "black",
    inputBackground: "white",
    inputValidBackground: "rgb(11, 121, 56)",
    inputInvalidBackground: "#d23939",
    inputBorderColor: "hsl(0, 0%, 80%)",

    checkboxColor: "#6d6d6d",
    checkboxColorActive: "white",

    messageBackground: "rgba(0, 0, 0, 0.15)",
    messageColor: "rgb(74, 74, 74)",

    messageBackgroundSuccess: "rgba(30, 232, 57, 0.18)",
    messageColorSuccess: "rgb(11, 121, 56)",

    messageBackgroundError: "rgba(210, 57, 57, 0.08)",
    messageColorError: "#d23939",

    messageBackgroundWarning: "rgba(241, 143, 38, 0.18)",
    messageColorWarning: "#9c5405",

    addEventButtonShadow: "rgba(0, 0, 0, 0.35)",

    formLoadingOverlay: "rgba(255, 255, 255, 0.8)",
  },
}

const darkTheme = {
  ...defaultTheme,
  name: "dark",
  colors: {
    ...defaultTheme.colors,
    siteColor: "#f9f9f9",
    siteBackground: "#1b1b1b",
    detailBackground: "#292929",
    overlay: "rgba(0, 0, 0, 0)",
    overlayActive: "rgba(0, 0, 0, 0.25)",

    title: "#fff",
    titleInverted: "black",
    text: "#f9f9f9",
    textInverted: "#3f3f3f",
    description: "#f9f9f9",
    descriptionInverted: "#292929",
    link: "#fff",
    linkInverted: "#000",
    linkHover: "#eee",
    linkHoverInverted: "#333",

    redBadge: "rgb(228, 17, 17)",
    greenBadge: "rgb(13, 132, 46)",

    boxBackground: "#292929",

    mainGradientFrom: "rgb(232, 57, 57)",
    mainGradientTo: "#410c9e",

    dialogOverlayBackground: "rgba(0, 0, 0, 0.65)",
    dialogContentBackground: "#333",

    horizontalMenuColor: "#e9e9e9",

    hr: "rgb(56, 56, 56)",

    buttonColor: "white",
    buttonBorder: "rgba(255, 255, 255, 0.25)",
    buttonBorderHover: "rgba(255, 255, 255, 0.45)",
    buttonBackgroundActive: "rgba(255, 255, 255, 0.05)",
    fancyButtonColor: "white",
    fancyButtonBackground: "#292929",
    veryFancyButtonColor: "white",

    deleteButtonColor: "#f75a5a",

    stickyListTitleBackground: "rgba(27, 27, 27, 0.85)",

    inputError: "#d23939",
    input: "white",
    inputBackground: "black",
    inputValidBackground: "rgb(11, 121, 56)",
    inputInvalidBackground: "#d23939",
    inputBorderColor: "#393939",

    checkboxColor: "#ababab",
    checkboxColorActive: "white",
  },
}

export const themes = {
  light: defaultTheme,
  dark: darkTheme,
}

export const ThemeProvider = ({ theme, ...props }) => {
  const usedTheme = themes[theme] || themes["light"]

  return <EmotionThemeProvider theme={usedTheme} {...props} />
}
