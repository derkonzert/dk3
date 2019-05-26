import React, { useState } from "react"

import { ListTitle, Text } from "@dk3/ui/atoms/Typography"
import { TextInput } from "@dk3/ui/form/TextInput"
import { FancyButton } from "@dk3/ui/form/Button"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"
import { State } from "react-powerplug"

export default function Index() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <SentryErrorBoundary>
      <ListTitle>Password Reset</ListTitle>
      {emailSent ? (
        <Text mv={4}>
          If an account exists with this email, we sent you an email with a link
          to reset your password.
          <br />
          <br />
          Make sure to also check your spam folder.
        </Text>
      ) : (
        <State initial={{ email: "" }}>
          {({ state, setState }) => (
            <form
              onSubmit={async e => {
                e.preventDefault()

                const uri =
                  process.env.NODE_ENV === "production"
                    ? "/auth/requestPasswordReset"
                    : "http://localhost:8004/auth/requestPasswordReset"

                try {
                  const response = await fetch(uri, {
                    method: "post",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      email: state.email,
                    }),
                  })

                  const json = await response.json()

                  if (response.status !== 200) {
                    throw new Error(json.message)
                  }

                  setEmailSent(true)
                } catch (err) {
                  // TODO: log error with sentry
                  setEmailSent(true)
                }
              }}
            >
              <Text>Request an email with a password reset link.</Text>
              <TextInput
                mv={3}
                type="email"
                label="Email Address"
                value={state.email}
                required
                onChange={e => {
                  setState({ email: e.target.value })
                }}
              />
              <FancyButton type="submit">Request reset link</FancyButton>
            </form>
          )}
        </State>
      )}
    </SentryErrorBoundary>
  )
}
