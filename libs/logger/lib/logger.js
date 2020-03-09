const config = require("@dk3/config")

/* Configure sentry dsn is available */
let Sentry
const sentryDsn = config.get("SENTRY_DSN", false)
if (sentryDsn) {
  Sentry = require("@sentry/node")
  Sentry.init({
    dsn: sentryDsn,
  })
}

exports.logger = (...args) => console.log(...args) /* eslint-disable-line */
exports.error = error => {
  // eslint-disable-next-line
  console.error(error)

  if (Sentry) {
    Sentry.captureException(error)
  }
}
exports.message = message => {
  if (Sentry) {
    Sentry.captureMessage(message)
  } else {
    console.info(message)
  }
}
