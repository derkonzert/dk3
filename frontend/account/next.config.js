const withCSS = require("@zeit/next-css")
const sharedWebpack = require("@dk3/shared-frontend/next.webpack.config")

const assetPrefix = process.env.NODE_ENV === "production" ? "/account" : ""

module.exports = withCSS({
  target: "serverless",

  assetPrefix,

  exportPathMap: async () => ({
    "/": { page: "/" },
  }),

  webpack: sharedWebpack,
})
