import React from "react"

import { Description, ListTitle } from "@dk3/ui/atoms/Typography"

import { SentryErrorBoundary } from "../../components/SentryErrorBoundary"
import { CurrentUser } from "../../components/CurrentUser"

import { LoginForm } from "../../components/form/LoginForm"
import { PageWrapper } from "../../components/PageWrapper"

export const getRedirectUrl = () => {
  try {
    /* Parse current URL */
    const u = new URL(location.href)
    /* Check for "re" url parameter */
    const re = u.searchParams.get("re")

    if (re) {
      /* Validate if "re" url param is valid URL */
      const redirectTo = new URL(re)

      /* Validate if "re" url param ends with current hostname */
      if (redirectTo.hostname.endsWith(u.hostname)) return redirectTo.href
    }
  } catch (err) {
    /* Silently ignore errors here */
  }

  return "/"
}

export default function Index() {
  return (
    <SentryErrorBoundary>
      <PageWrapper>
        <ListTitle>Login</ListTitle>
        <CurrentUser>
          {({ isLoggedIn }) =>
            isLoggedIn ? (
              <div>You are already logged in</div>
            ) : (
              <React.Fragment>
                <Description>Enter your credentials to sign in</Description>
                <LoginForm
                  onLogin={() => {
                    window.location.href = getRedirectUrl()
                  }}
                />
              </React.Fragment>
            )
          }
        </CurrentUser>
      </PageWrapper>
    </SentryErrorBoundary>
  )
}
