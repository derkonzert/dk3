module.exports = {
  webpack: cfg => {
    cfg.module.rules.forEach(rule => {
      if (rule.use.loader === "next-babel-loader") {
        rule.include.push(/@dk3\/ui/)
        rule.include.push(/dk3\/libs\/ui/)
      }
    })

    return cfg
  },
}
