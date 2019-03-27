import App, { Container } from "next/app"
import React from "react"
import Link from "next/link"
import { ApolloProvider } from "react-apollo"
import { PageWrapper } from "../components/PageWrapper"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import withApollo, { logout } from "@dk3/shared-frontend/lib/withApollo"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props

    return (
      <Container>
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
                    {isLoggedIn ? (
                      <React.Fragment>
                        <Link href="/">
                          <HorizontalMenuItem href="/account/">
                            Settings
                          </HorizontalMenuItem>
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
                        <Link href="login">
                          <HorizontalMenuItem href="/account/login">
                            Login
                          </HorizontalMenuItem>
                        </Link>
                        <Link href="signup">
                          <HorizontalMenuItem href="/account/signup">
                            Sign Up
                          </HorizontalMenuItem>
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
      </Container>
    )
  }
}

export default withApollo(MyApp)
