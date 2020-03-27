import * as Sentry from "@sentry/browser"

if (process.env.SENTRY_DSN_FRONTEND) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_FRONTEND,
  })
}

export { Sentry }
