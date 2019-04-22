const withCSS = require("@zeit/next-css")
const sharedWebpack = require("@dk3/shared-frontend/next.webpack.config")

const assetPrefix = process.env.NODE_ENV === "production" ? "/pages" : ""

module.exports = withCSS({
  target: "serverless",

  assetPrefix,

  exportPathMap: async () => ({
    "/": { page: "/" },
  }),
  pageExtensions: ["js", "jsx", "mdx"],
  // webpack: sharedWebpack,
  webpack: (config, options) => {
    const sharedConfig = sharedWebpack(config, options)

    sharedConfig.module.rules.push({
      test: /\.mdx/,
      use: [
        options.defaultLoaders.babel,
        {
          loader: "@mdx-js/loader",
        },
      ],
    })

    return sharedConfig
  },
})
