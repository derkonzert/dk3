import React from "react"

import PropTypes from "prop-types"
import { getDataFromTree } from "react-apollo"
import Head from "next/head"

import initApollo from "./initApollo"

import nextCookie from "next-cookies"
import cookie from "js-cookie"

export const login = async ({ token }) => {
  cookie.set("token", token, { expires: 1 })
}

export const logout = () => {
  cookie.remove("token")
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now())
}

export const getApiUri = ctx => {
  if (process.env.NODE_ENV === "production") {
    return process.browser
      ? `${location.protocol}//${window.location.host}/api`
      : `https://${ctx.req.headers.host}/api`
  } else {
    return "http://localhost:8004/api"
  }
}

export const getAccessToken = ctx => {
  const { token } = nextCookie(ctx)

  if (!token) {
    return undefined
  }

  return token
}

export default App => {
  class WithData extends React.Component {
    constructor(props) {
      super(props)

      this.syncLogout = this.syncLogout.bind(this)

      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, {
        uri: props.apiUri,
        getToken: () => {
          return getAccessToken({})
        },
      })
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout)
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout)
      window.localStorage.removeItem("logout")
    }

    syncLogout(event) {
      if (event.key === "logout") {
        // Logout happened in another window
        this.apolloClient.resetStore()
      }
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }

  WithData.displayName = `WithData(${App.displayName})`
  WithData.propTypes = {
    apolloState: PropTypes.object.isRequired,
  }

  WithData.getInitialProps = async props => {
    const { Component, router, ctx } = props
    const { res } = ctx
    const token = getAccessToken(ctx)
    const uri = getApiUri(ctx)

    const apollo = initApollo(
      {},
      {
        uri,
        getToken: () => token,
      }
    )

    ctx.apolloClient = apollo

    let appProps = {}
    if (App.getInitialProps) {
      appProps = await App.getInitialProps(props)
    }

    if (res && res.finished) {
      // When redirecting, the response is finished.
      // No point in continuing to render
      return {}
    }

    if (!process.browser) {
      // Run all graphql queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries

        await getDataFromTree(
          <App
            {...appProps}
            Component={Component}
            router={router}
            apolloClient={apollo}
          />
        )
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
        // eslint-disable-next-line no-console
        console.error("Error while running `getDataFromTree`", error)
      }

      // getDataFromTree does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind()
    }

    // Extract query data from the Apollo's store
    const apolloState = apollo.cache.extract()

    return {
      ...appProps,
      apiUri: uri,
      token,
      apolloState,
    }
  }

  return WithData
}
