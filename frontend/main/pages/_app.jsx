import React from "react"
import App, { Container } from "next/app"
import nextCookie from "next-cookies"
import cookie from "js-cookie"
import { ApolloProvider } from "react-apollo"

import { PageWrapper } from "../components/PageWrapper"
import { withApollo } from "@dk3/shared-frontend/lib/withApollo"
import { withThemeFromCookie } from "@dk3/shared-frontend/lib/withThemeFromCookie"

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
  static getInitialProps({ ctx }) {
    /* hidekeks coming from dk2 */
    const { cookieConsent, hidekeks } = nextCookie(ctx)

    return {
      showCookieConsent: !(hidekeks === "1" || cookieConsent === "true"),
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      showCookieConsent: props.showCookieConsent,
    }
  }

  render() {
    const {
      Component,
      theme,
      onThemeChange,
      pageProps,
      apolloClient,
    } = this.props
    const { showCookieConsent } = this.state

    return (
      <ThemeProvider theme={theme}>
        <RichTextProvider value={rtxtPlugins}>
          <PageWrapper>
            <Container>
              <ApolloProvider client={apolloClient}>
                <Component
                  {...pageProps}
                  themeName={theme}
                  onThemeChange={onThemeChange}
                />
              </ApolloProvider>
            </Container>
            {showCookieConsent && (
              <CookieConsent
                onClick={() => {
                  this.setState({
                    showCookieConsent: false,
                  })
                  cookie.set("cookieConsent", true)
                }}
              >
                <Text>
                  We use cookies to provide the best possible features and
                  service on our website. By using our website, you agree to
                  this. Read more in our{" "}
                  <UiLink href="/pages/privacy">Privacy Policy</UiLink>.
                </Text>
              </CookieConsent>
            )}
          </PageWrapper>
        </RichTextProvider>
      </ThemeProvider>
    )
  }
}

export default withThemeFromCookie(withApollo(MyApp))
