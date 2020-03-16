import React from "react"

// import PropTypes from "prop-types"
// import { getDataFromTree } from "react-apollo"
// import Head from "next/head"

import initApollo from "./initApollo"

import nextCookie from "next-cookies"
import cookie from "js-cookie"

export const login = async ({ token, expiresAt }) => {
  const expires = (expiresAt - Date.now()) / (1000 * 60 * 60 * 24)

  cookie.set("token", token, {
    expires,
    domain: window.location.hostname,
    secure: process.env.NODE_ENV === "production",
  })
}

export const logout = () => {
  cookie.remove("token", {
    domain: window.location.hostname,
    secure: process.env.NODE_ENV === "production",
  })
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now())
}

export const getHostname = ctx => {
  if (process.env.NODE_ENV === "production") {
    return process.browser ? window.location.host : ctx.req.headers.host
  } else {
    return "localhost"
  }
}

export const getApiUri = ctx => {
  const hostname = getHostname(ctx)

  if (process.env.NODE_ENV === "production") {
    return process.browser
      ? `${location.protocol}//${hostname}/api`
      : `https://${hostname}/api`
  } else {
    return `http://${hostname}:3000/api`
  }
}

export const getAccessToken = ctx => {
  const { token } = nextCookie(ctx)

  if (!token) {
    return undefined
  }

  return token
}

export const withApollo = App => {
  class WithData extends React.Component {
    constructor(props) {
      super(props)

      this.syncLogout = this.syncLogout.bind(this)

      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      // this.apolloClient = initApollo(props.apolloState, {
      //   uri: props.apiUri,
      //   getToken: () => {
      //     return getAccessToken({})
      //   },
      // })
      this.apolloClient = initApollo(null, {
        uri: process.env.NODE_ENV === "production" ? "/api" : "/api",
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
      return <App apolloClient={this.apolloClient} {...this.props} />
    }
  }

  WithData.displayName = "WithData(App)"
  // WithData.propTypes = {
  //   apolloState: PropTypes.object.isRequired,
  // }

  // WithData.getInitialProps = async props => {
  //   const { AppTree, ctx } = props
  //   const { res } = ctx
  //   const token = getAccessToken(ctx)
  //   const uri = getApiUri(ctx)

  //   const apollo = initApollo(
  //     {},
  //     {
  //       uri,
  //       getToken: () => token,
  //       on404: () => {
  //         res.statusCode = 404
  //       },
  //     }
  //   )

  //   ctx.apolloClient = apollo

  //   let appProps = {}
  //   if (App.getInitialProps) {
  //     appProps = await App.getInitialProps(props)
  //   }

  //   if (res && res.finished) {
  //     // When redirecting, the response is finished.
  //     // No point in continuing to render
  //     return {}
  //   }

  //   if (!process.browser) {
  //     // Run all graphql queries in the component tree
  //     // and extract the resulting data
  //     try {
  //       // Run all GraphQL queries

  //       await getDataFromTree(<AppTree {...appProps} apolloClient={apollo} />)
  //     } catch (error) {
  //       // Prevent Apollo Client GraphQL errors from crashing SSR.
  //       // Handle them in components via the data.error prop:
  //       // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
  //       // eslint-disable-next-line no-console
  //       console.error("Error while running `getDataFromTree`", error)
  //     }

  //     // getDataFromTree does not call componentWillUnmount
  //     // head side effect therefore need to be cleared manually
  //     Head.rewind()
  //   }

  //   // Extract query data from the Apollo's store
  //   const apolloState = apollo.cache.extract()

  //   return {
  //     ...appProps,
  //     apiUri: uri,
  //     token,
  //     apolloState,
  //   }
  // }

  return WithData
}
