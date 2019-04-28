import React from "react"
import cookie from "js-cookie"
import nextCookie from "next-cookies"

export const withThemeFromCookie = Component => {
  class WithThemeFromCookie extends React.Component {
    constructor(props) {
      super(props)

      this.onThemeChange = this.onThemeChange.bind(this)

      let theme = "light"

      if (process.browser) {
        theme = cookie.get("theme") || theme
      } else {
        theme = props.theme
      }

      this.state = {
        theme,
      }
    }

    onThemeChange(theme) {
      this.setState({ theme })

      cookie.set("theme", theme, {
        secure: process.env.NODE_ENV === "production",
        expires: 356,
      })
    }

    render() {
      return (
        <Component
          {...this.props}
          onThemeChange={this.onThemeChange}
          theme={this.state.theme}
        />
      )
    }
  }

  WithThemeFromCookie.getInitialProps = async context => {
    const { theme } = nextCookie(context.ctx)

    let componentProps = {}
    if (Component.getInitialProps) {
      componentProps = await Component.getInitialProps(context)
    }

    return {
      ...componentProps,
      theme: theme || "light",
    }
  }

  return WithThemeFromCookie
}
