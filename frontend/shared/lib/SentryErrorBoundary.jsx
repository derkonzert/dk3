import React from "react"
import * as Sentry from "@sentry/browser"

if (process.browser && process.env.SENTRY_DSN_FRONTEND) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN_FRONTEND,
  })
}

export class SentryErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, eventId: null }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error })

    Sentry.withScope(scope => {
      scope.setExtras(errorInfo)
      const eventId = Sentry.captureException(error)
      this.setState({ eventId })
    })
  }

  render() {
    if (this.state.error) {
      //render fallback UI
      return (
        <a
          onClick={() =>
            Sentry.showReportDialog({ eventId: this.state.eventId })
          }
        >
          Report feedback
        </a>
      )
    } else {
      //when there's not an error, render children untouched
      return this.props.children
    }
  }
}
