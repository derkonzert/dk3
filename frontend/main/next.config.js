module.exports = {
  target: "serverless",

  exportPathMap: async () => ({
    "/": { page: "/" },
    "/c": { page: "/c" },
  }),

  webpack: cfg => {
    cfg.module.rules.forEach(rule => {
      if (rule.use.loader === "next-babel-loader") {
        rule.include.push(/@dk3\/ui/)
        rule.include.push(/libs\/ui/)
      }
    })

    return cfg
  },
}
