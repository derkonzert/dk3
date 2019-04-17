import App, { Container } from "next/app"
import React from "react"
import Link from "next/link"
import { ApolloProvider } from "react-apollo"
import { PageWrapper } from "../components/PageWrapper"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { withApollo, logout } from "@dk3/shared-frontend/lib/withApollo"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"

import { ThemeProvider } from "@dk3/ui/theme"
import { withThemeFromCookie } from "@dk3/shared-frontend/lib/withThemeFromCookie"

class MyApp extends App {
  render() {
    const { Component, theme, pageProps, apolloClient } = this.props

    return (
      <Container>
        <ThemeProvider theme={theme}>
          <ApolloProvider client={apolloClient}>
            <CurrentUser>
              {currentUserProps => {
                const { loading, isLoggedIn } = currentUserProps
                if (loading) {
                  return <Spinner />
                }

                return (
                  <React.Fragment>
                    <HorizontalMenu>
                      <HorizontalMenuItem href="/">
                        ↩︎ Back to derkonzert
                      </HorizontalMenuItem>

                      {isLoggedIn ? (
                        <React.Fragment>
                          <Link href="/account/" passHref>
                            <HorizontalMenuItem>Settings</HorizontalMenuItem>
                          </Link>
                          <HorizontalMenuItem
                            href="#"
                            onClick={e => {
                              e.preventDefault()
                              logout()
                              apolloClient.resetStore()
                            }}
                          >
                            Logout
                          </HorizontalMenuItem>
                        </React.Fragment>
                      ) : (
                        <React.Fragment>
                          <Link href="/account/login" passHref>
                            <HorizontalMenuItem>Login</HorizontalMenuItem>
                          </Link>
                          <Link href="/account/signup" passHref>
                            <HorizontalMenuItem>Sign Up</HorizontalMenuItem>
                          </Link>
                        </React.Fragment>
                      )}
                    </HorizontalMenu>
                    <PageWrapper>
                      <Component {...pageProps} {...currentUserProps} />
                    </PageWrapper>
                  </React.Fragment>
                )
              }}
            </CurrentUser>
          </ApolloProvider>
        </ThemeProvider>
      </Container>
    )
  }
}

export default withThemeFromCookie(withApollo(MyApp))
