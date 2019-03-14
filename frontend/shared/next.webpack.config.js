const path = require("path")

module.exports = cfg => {
  cfg.module.rules.forEach(rule => {
    if (rule.use.loader === "next-babel-loader") {
      rule.include.push(path.resolve("../../"))
      // rule.include.push(/@dk3\/ui/)
      // rule.include.push(/@dk3\/shared-frontend/)
      // rule.include.push(/libs\/ui/)
      // rule.include.push(/shared/)
    }
  })

  return cfg
}
