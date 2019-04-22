import App, { Container } from "next/app"
import React from "react"
import Link from "next/link"
import { ApolloProvider } from "react-apollo"
import { PageWrapper } from "../components/PageWrapper"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { withApollo, logout } from "@dk3/shared-frontend/lib/withApollo"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import { Flex } from "@dk3/ui/atoms/Flex"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"

import { ThemeProvider } from "@dk3/ui/theme"
import { withThemeFromCookie } from "@dk3/shared-frontend/lib/withThemeFromCookie"
import { Footer } from "@dk3/ui/components/Footer"
import { FooterLinks } from "@dk3/shared-frontend/FooterLinks"

class MyApp extends App {
  render() {
    const {
      onThemeChange,
      Component,
      theme,
      pageProps,
      apolloClient,
    } = this.props

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
                      <Flex grow={1} justifyContent="space-between">
                        <HorizontalMenuItem href="/">
                          ↩︎ Back to derkonzert
                        </HorizontalMenuItem>

                        <Flex justifyItems="flex-end">
                          {isLoggedIn ? (
                            <React.Fragment>
                              <Link href="/" as="/account/" passHref>
                                <HorizontalMenuItem>
                                  Settings
                                </HorizontalMenuItem>
                              </Link>
                              <Link
                                href="/calendar"
                                as="/account/calendar"
                                passHref
                              >
                                <HorizontalMenuItem>
                                  Calendar
                                </HorizontalMenuItem>
                              </Link>
                              <HorizontalMenuItem
                                href="#"
                                onClick={async e => {
                                  e.preventDefault()

                                  await logout()

                                  await apolloClient.resetStore()

                                  window.location.href = "/"
                                }}
                              >
                                Logout
                              </HorizontalMenuItem>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Link href="/login" as="/account/login" passHref>
                                <HorizontalMenuItem>Login</HorizontalMenuItem>
                              </Link>
                              <Link
                                href="/signup"
                                as="/account/signup"
                                passHref
                              >
                                <HorizontalMenuItem>Sign Up</HorizontalMenuItem>
                              </Link>
                            </React.Fragment>
                          )}
                        </Flex>
                      </Flex>
                    </HorizontalMenu>
                    <PageWrapper>
                      <Component {...pageProps} {...currentUserProps} />
                    </PageWrapper>
                  </React.Fragment>
                )
              }}
            </CurrentUser>
            <Footer>
              <FooterLinks
                themeName={theme}
                onThemeChange={e => {
                  onThemeChange(e.target.checked ? "dark" : "light")
                }}
              />
            </Footer>
          </ApolloProvider>
        </ThemeProvider>
      </Container>
    )
  }
}

export default withThemeFromCookie(withApollo(MyApp))
