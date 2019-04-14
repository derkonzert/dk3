import App, { Container } from "next/app"
import React from "react"
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
import { Link as UILink, Title } from "@dk3/ui/atoms/Typography"

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
  Link.createCopy({ meta: { Component: UILink } }),
  Vimeo.createCopy({ meta: { Component: Iframe } }),
  YouTube.createCopy({ meta: { Component: Iframe } }),
  Spotify.createCopy({ meta: { Component: Iframe } }),
]

class MyApp extends App {
  render() {
    const {
      Component,
      theme,
      onThemeChange,
      pageProps,
      apolloClient,
    } = this.props

    return (
      <ThemeProvider theme={theme}>
        <RichTextProvider value={rtxtPlugins}>
          <PageWrapper>
            <Container>
              <ApolloProvider client={apolloClient}>
                <Component {...pageProps} />
              </ApolloProvider>
              <button
                style={{ position: "fixed", left: 0, bottom: 0 }}
                onClick={() => {
                  const newTheme = theme === "light" ? "dark" : "light"

                  onThemeChange(newTheme)
                }}
              >
                {theme === "light" ? "Use dark theme" : "Use light theme"}
              </button>
            </Container>
          </PageWrapper>
        </RichTextProvider>
      </ThemeProvider>
    )
  }
}

export default withThemeFromCookie(withApollo(MyApp))
