import React, { createContext } from "react"
import { createTokens } from "./rtxt"
import * as Plugins from "./plugins"

export const Headlines = Plugins.Headlines.createCopy({
  meta: {
    Component: {
      h1: "h1",
      h2: "h2",
      h3: "h3",
    },
  },
  renderer: function(token, props) {
    return React.createElement(
      this.meta.Component[token.value.headlineType],
      props,
      token.value.line
    )
  },
})

export const Link = Plugins.Link.createCopy({
  meta: { Component: "a" },
  renderer: function(token, props) {
    return React.createElement(
      this.meta.Component,
      {
        ...props,
        href: token.value.href,
      },
      token.value.href
    )
  },
})

export const YouTube = Plugins.YouTube.createCopy({
  meta: { Component: "iframe" },
  renderer: function(token, props) {
    return React.createElement(this.meta.Component, {
      ...props,
      src: `https://www.youtube.com/embed/${token.value.id}`,
    })
  },
})

export const Vimeo = Plugins.Vimeo.createCopy({
  meta: { Component: "iframe" },
  renderer: function(token, props) {
    return React.createElement(this.meta.Component, {
      ...props,
      src: `https://player.vimeo.com/video/${token.value.id}`,
    })
  },
})

export const DEFAULT_PLUGINS = [Headlines, Link, YouTube, Vimeo]

export const { Provider, Consumer } = createContext(DEFAULT_PLUGINS)

const RichText = React.memo(({ value, ...props }) => (
  <Consumer>
    {plugins => {
      const tokens = createTokens(value, plugins)

      return (
        <React.Fragment>
          {tokens.map((lineTokens, index) => (
            <React.Fragment key={index}>
              {lineTokens.map((token, windex) => (
                <React.Fragment key={"token" + windex}>
                  {token.render(props)}
                  {windex !== lineTokens.length - 1 && " "}
                </React.Fragment>
              ))}
              {index !== lineTokens.length - 1 && <br />}
            </React.Fragment>
          ))}
        </React.Fragment>
      )
    }}
  </Consumer>
))

export default RichText
