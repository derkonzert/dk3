const startCi = require("./lib/start-ci")

startCi().then(
  () => {
    // Bye
  },
  err => {
    console.error(err) // eslint-disable-line

    process.exit(1)
  }
)
