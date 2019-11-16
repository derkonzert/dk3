const withCSS = require("@zeit/next-css")

const sharedWebpack = require("@dk3/shared-frontend/next.webpack.config")

module.exports = withCSS({
  target: "serverless",

  env: {
    SENTRY_DSN_FRONTEND: process.env.SENTRY_DSN_FRONTEND,
  },

  pageExtensions: ["js", "jsx", "mdx"],

  exportPathMap: async () => ({
    "/": { page: "/" },
    "/mine": { page: "/", query: { showMine: 1 } },
    "/add-new-event": { page: "/", query: { addEvent: 1 } },
  }),

  webpack: sharedWebpack,
})
