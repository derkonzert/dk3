import React from "react"
import { withRouter } from "next/router"
import { ListTitle } from "@dk3/ui/atoms/Typography"

import { FancyButton } from "@dk3/ui/form/Button"
import { State } from "react-powerplug"
import { TextInput } from "@dk3/ui/form/TextInput"
import { ErrorMessage, Message } from "@dk3/ui/atoms/Message"

const SignUpActivate = withRouter(function SignUpActivate({ router }) {
  return (
    <React.Fragment>
      <ListTitle>Set New Password</ListTitle>

      <State
        initial={{
          formError: false,
          formSuccess: false,
          password: "",
          passwordError: "",
          passwordRepeat: "",
          passwordRepeatError: "",
        }}
      >
        {({ state, setState }) => (
          <form
            onSubmit={async e => {
              e.preventDefault()
              const fieldErrors = []

              if (state.password.length < 8) {
                fieldErrors.push([
                  "passwordError",
                  "Please provide a password with at least 8 characters",
                ])
              }

              if (state.password !== state.passwordRepeat) {
                fieldErrors.push([
                  "passwordRepeatError",
                  "Passwords don't match",
                ])
              }

              if (fieldErrors.length) {
                setState(
                  fieldErrors.reduce(
                    (newState, [field, errorMessage]) => {
                      newState[field] = errorMessage
                      return newState
                    },
                    {
                      passwordError: "",
                      passwordRepeatError: "",
                    }
                  )
                )
                return
              }

              const uri =
                process.env.NODE_ENV === "production"
                  ? "/auth/passwordReset"
                  : "http://localhost:8004/auth/passwordReset"

              try {
                const response = await fetch(uri, {
                  method: "post",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    token: router.query.token,
                    password: state.password,
                  }),
                })

                const json = await response.json()

                if (response.status !== 200) {
                  throw new Error(json.message)
                }

                setState({ formSuccess: true })
              } catch (err) {
                // TODO: log error with sentry
                setState({ formError: err.message })
              }
            }}
          >
            {state.formError && <ErrorMessage>{state.formError}</ErrorMessage>}
            {state.formSuccess && (
              <Message>Your new password has been set!</Message>
            )}
            <TextInput
              mv={3}
              type="password"
              name="password"
              error={state.passwordError}
              label="New Password"
              value={state.password}
              required
              onChange={e => {
                setState({ password: e.target.value })
              }}
            />
            <TextInput
              mv={3}
              type="password"
              name="password-repeat"
              error={state.passwordRepeatError}
              label="Repeat New Password"
              value={state.passwordRepeat}
              required
              onChange={e => {
                setState({ passwordRepeat: e.target.value })
              }}
            />
            <FancyButton type="submit">Set New Password</FancyButton>
          </form>
        )}
      </State>
    </React.Fragment>
  )
})

export default SignUpActivate
