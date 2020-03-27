import React from "react"
import App from "next/app"
// import nextCookie from "next-cookies"
import cookie from "js-cookie"
import { ApolloProvider } from "react-apollo"

import { Global } from "@emotion/core"
import { global } from "@dk3/ui/documentStyles"
import { withApollo } from "../lib/withApollo"

import { ThemeProvider } from "@dk3/ui/theme"
import {
  Provider as RichTextProvider,
  Headlines,
  Link,
  YouTube,
  Vimeo,
  Spotify,
} from "@dk3/rtxt/react"
import { Iframe } from "@dk3/ui/atoms/Iframe"
import { Link as UiLink, Title, Text } from "@dk3/ui/atoms/Typography"
import { CookieConsent } from "../components/CookieConsent"

const rtxtPlugins = [
  Headlines.createCopy({
    meta: {
      Component: {
        h1: Title,
        h2: Title,
        h3: Title,
      },
    },
  }),
  Link.createCopy({ meta: { Component: UiLink } }),
  Vimeo.createCopy({ meta: { Component: Iframe } }),
  YouTube.createCopy({ meta: { Component: Iframe } }),
  Spotify.createCopy({ meta: { Component: Iframe } }),
]

class MyApp extends App {
  // static async getInitialProps({ ctx, ...props }) {
  //   /* hidekeks coming from dk2 */
  //   const appProps = await App.getInitialProps({ ctx, ...props })

  //   const { cookieConsent, hidekeks } = nextCookie(ctx)

  //   return {
  //     ...appProps,
  //     showCookieConsent: !(hidekeks === "1" || cookieConsent === "true"),
  //   }
  // }

  constructor(props) {
    super(props)

    this.state = {
      showCookieConsent: false,
    }
  }

  componentDidMount() {
    if (cookie.get("cookieConsent") !== "true") {
      this.setState({ showCookieConsent: true })
    }
  }

  render() {
    const { Component, theme = "light", pageProps, apolloClient } = this.props
    const { showCookieConsent } = this.state

    return (
      <ThemeProvider theme={theme}>
        <RichTextProvider value={rtxtPlugins}>
          <Global styles={global} />

          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>

          {showCookieConsent && (
            <CookieConsent
              onClick={() => {
                this.setState({
                  showCookieConsent: false,
                })
                cookie.set("cookieConsent", true, {
                  expires: 365,
                  secure: process.env.NODE_ENV === "production",
                })
              }}
            >
              <Text>
                We use cookies to provide the best possible features and service
                on our website. By using our website, you agree to this. Read
                more in our{" "}
                <UiLink href="/pages/privacy">Privacy Policy</UiLink>.
              </Text>
            </CookieConsent>
          )}
        </RichTextProvider>
      </ThemeProvider>
    )
  }
}

export default withApollo(MyApp)
