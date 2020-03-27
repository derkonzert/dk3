const withCSS = require("@zeit/next-css")
const webpack = require("webpack")
const path = require("path")

module.exports = withCSS({
  target: "serverless",

  exportTrailingSlash: false,

  env: {
    SENTRY_DSN_FRONTEND: process.env.SENTRY_DSN_FRONTEND,
  },

  pageExtensions: ["js", "jsx", "mdx"],

  webpack: (cfg, options) => {
    cfg.module.rules.forEach(rule => {
      if (rule.use && rule.use.loader === "next-babel-loader") {
        rule.include.push(path.resolve("../../"))
      }
    })

    cfg.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
        },
      ],
    })

    cfg.plugins.push(
      new webpack.IgnorePlugin(/unicode\/category\/So/, /node_modules/)
    )

    return cfg
  },
})
