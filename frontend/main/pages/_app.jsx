import App, { Container } from "next/app"
import React from "react"
import { ApolloProvider } from "react-apollo"
import { PageWrapper } from "../components/PageWrapper"
import withApollo from "../lib/withApollo"

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props

    return (
      <PageWrapper>
        <Container>
          <ApolloProvider client={apolloClient}>
            <Component {...pageProps} />
          </ApolloProvider>
        </Container>
      </PageWrapper>
    )
  }
}

export default withApollo(MyApp)
