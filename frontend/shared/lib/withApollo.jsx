import React from "react"

import PropTypes from "prop-types"
// import { getDataFromTree } from "react-apollo"
import Head from "next/head"

import initApollo from "./initApollo"

function getAccessToken(/* req, options = {} */) {
  if (!process.browser) {
    // Token currently stored in localStorage,
    // so there is no token on the server side.
    return undefined
  }

  return localStorage.getItem("accessToken") || undefined
}

export default App => {
  class WithData extends React.Component {
    constructor(props) {
      super(props)
      // `getDataFromTree` renders the component first, the client is passed off as a property.
      // After that rendering is done using Next's normal rendering pipeline
      this.apolloClient = initApollo(props.apolloState, {
        getToken: () => {
          return getAccessToken()
        },
      })
    }

    render() {
      return <App {...this.props} apolloClient={this.apolloClient} />
    }
  }

  WithData.displayName = `WithData(${App.displayName})`
  WithData.propTypes = {
    apolloState: PropTypes.object.isRequired,
  }

  WithData.getInitialProps = async ctx => {
    const {
      /* Component,
      router, */
      ctx: { req, res },
    } = ctx
    const apollo = initApollo(
      {},
      {
        getToken: () => getAccessToken(req),
      }
    )

    ctx.ctx.apolloClient = apollo

    let appProps = {}
    if (App.getInitialProps) {
      appProps = await App.getInitialProps(ctx)
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
        /* TODO: reenable serverside gql data fetching */
        // await getDataFromTree(
        //   <App
        //     {...appProps}
        //     Component={Component}
        //     router={router}
        //     apolloClient={apollo}
        //   />
        // )
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
      apolloState,
    }
  }

  return WithData
}
