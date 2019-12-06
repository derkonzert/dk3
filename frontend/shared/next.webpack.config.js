const webpack = require("webpack")
const path = require("path")

module.exports = (cfg, options) => {
  cfg.module.rules.forEach(rule => {
    if (rule.use.loader === "next-babel-loader") {
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
}
