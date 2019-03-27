import App, { Container } from "next/app"
import React from "react"
import Link from "next/link"
import { ApolloProvider } from "react-apollo"
import { PageWrapper } from "../components/PageWrapper"
import withApollo from "@dk3/shared-frontend/lib/withApollo"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { Spinner } from "@dk3/ui/atoms/Spinner"

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props

    return (
      <PageWrapper>
        <Container>
          <ApolloProvider client={apolloClient}>
            <CurrentUser>
              {({ isLoggedIn, loading }) => {
                if (loading) {
                  return <Spinner />
                }

                return (
                  <HorizontalMenu>
                    {isLoggedIn ? (
                      <Link href="/account/">
                        <HorizontalMenuItem href="/account/">
                          Account
                        </HorizontalMenuItem>
                      </Link>
                    ) : (
                      <React.Fragment>
                        <Link href="/account/login">
                          <HorizontalMenuItem href="/account/login">
                            Login
                          </HorizontalMenuItem>
                        </Link>
                        <Link href="/account/signup">
                          <HorizontalMenuItem href="/account/signup">
                            Sign Up
                          </HorizontalMenuItem>
                        </Link>
                      </React.Fragment>
                    )}
                  </HorizontalMenu>
                )
              }}
            </CurrentUser>
            <Component {...pageProps} />
          </ApolloProvider>
        </Container>
      </PageWrapper>
    )
  }
}

export default withApollo(MyApp)
