import { css } from "docz-plugin-css"

export default {
  title: "@dk3/ui",
  description: "UI elements for dk3",
  wrapper: "utils/doczWrapper",
  dest: "/dist",
  hashRouter: true,
  codeSandbox: false,
  plugins: [css()],
  themeConfig: {
    showPlaygroundEditor: false,
    colors: {
      primary: "rgb(255, 87, 87)",
    },
    styles: {
      playground: {
        backgroundColor: "#f9f9f9",
      },
    },
  },
}
