const path = require("path")

module.exports = cfg => {
  cfg.module.rules.forEach(rule => {
    if (rule.use.loader === "next-babel-loader") {
      rule.include.push(path.resolve("../../"))
    }
  })

  return cfg
}
