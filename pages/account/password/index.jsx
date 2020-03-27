import React, { useState } from "react"
import { State } from "react-powerplug"

import { ListTitle, Text } from "@dk3/ui/atoms/Typography"
import { TextInput } from "@dk3/ui/form/TextInput"
import { FancyButton } from "@dk3/ui/form/Button"

import { SentryErrorBoundary } from "../../../components/SentryErrorBoundary"
import { PageWrapper } from "../../../components/PageWrapper"

export default function Index() {
  const [emailSent, setEmailSent] = useState(false)

  return (
    <SentryErrorBoundary>
      <PageWrapper>
        <ListTitle>Password Reset</ListTitle>
        {emailSent ? (
          <Text mv="l">
            If an account exists with this email, we sent you an email with a
            link to reset your password.
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

                  const uri = "/auth/requestPasswordReset"

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
                  mv="m"
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
      </PageWrapper>
    </SentryErrorBoundary>
  )
}
