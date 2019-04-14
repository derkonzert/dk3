const webpack = require("webpack")
const path = require("path")

module.exports = cfg => {
  cfg.module.rules.forEach(rule => {
    if (rule.use.loader === "next-babel-loader") {
      rule.include.push(path.resolve("../../"))
    }
  })

  cfg.plugins.push(
    new webpack.IgnorePlugin(/unicode\/category\/So/, /node_modules/)
  )

  return cfg
}
