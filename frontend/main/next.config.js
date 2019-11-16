const withCSS = require("@zeit/next-css")

const sharedWebpack = require("@dk3/shared-frontend/next.webpack.config")

module.exports = withCSS({
  target: "serverless",

  env: {
    SENTRY_DSN_FRONTEND: process.env.SENTRY_DSN_FRONTEND,
  },

  pageExtensions: ["js", "jsx", "mdx"],

  webpack: sharedWebpack,
})
