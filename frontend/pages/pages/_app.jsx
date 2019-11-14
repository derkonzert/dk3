import App from "next/app"
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

import { FooterLinks } from "@dk3/shared-frontend/lib/FooterLinks"
import { Footer } from "@dk3/ui/components/Footer"

class MyApp extends App {
  // static async getInitialProps({ ctx, ...props }) {
  //   /* hidekeks coming from dk2 */
  //   const appProps = await App.getInitialProps({ ctx, ...props })

  //   return {
  //     ...appProps,
  //   }
  // }

  render() {
    const { Component, theme = "light", pageProps, apolloClient } = this.props

    return (
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
                              <HorizontalMenuItem>Settings</HorizontalMenuItem>
                            </Link>
                            <Link
                              href="/calendar"
                              as="/account/calendar"
                              passHref
                            >
                              <HorizontalMenuItem>Calendar</HorizontalMenuItem>
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
                            <Link href="/signup" as="/account/signup" passHref>
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
                  <Footer>
                    <FooterLinks />
                  </Footer>
                </React.Fragment>
              )
            }}
          </CurrentUser>
        </ApolloProvider>
      </ThemeProvider>
    )
  }
}

export default withApollo(MyApp)
