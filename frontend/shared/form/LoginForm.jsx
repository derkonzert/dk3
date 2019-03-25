import React from "react"
import { TextInput } from "@dk3/ui/form/TextInput"
import { State } from "react-powerplug"
import { FancyButton, Button } from "@dk3/ui/form/Button"
import { withApollo } from "react-apollo"
import { login } from "../lib/withApollo"

export const LoginForm = withApollo(({ onLogin, onCancel, client }) => {
  return (
    <State initial={{ email: "", password: "", message: "", loading: false }}>
      {({ state, setState, resetState }) => (
        <form
          onSubmit={e => {
            setState({ loading: true })
            e.preventDefault()

            const uri =
              process.env.NODE_ENV === "production"
                ? "/auth/signIn"
                : "http://localhost:8004/auth/signIn"

            fetch(uri, {
              method: "post",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                email: state.email,
                password: state.password,
              }),
            })
              .then(resp => Promise.all([resp.status, resp.json()]))
              .then(([status, data]) => {
                if (data.message) {
                  setState({
                    message: data.message,
                    loading: false,
                  })
                }

                if (status > 200) {
                  throw new Error(data.message || `Received status ${status}`)
                }

                if (data.accessToken) {
                  login({ token: data.accessToken })

                  return client.resetStore()
                }
              })
              .then(() => {
                resetState()

                onLogin && onLogin()
              })
              .catch(err => {
                setState({ message: err.message, loading: false })
              })
          }}
        >
          {!!state.message && <span>{state.message}</span>}
          <TextInput
            label="E-Mail Address"
            value={state.email}
            onChange={e => setState({ email: e.target.value })}
            type="email"
            name="email"
          />
          <TextInput
            label="Password"
            value={state.password}
            onChange={e => setState({ password: e.target.value })}
            type="password"
            name="password"
          />
          <div style={{ display: "flex" }}>
            {!!onCancel && (
              <Button type="button" mr={3} onClick={onCancel}>
                Cancel
              </Button>
            )}
            <FancyButton
              disabled={state.loading}
              ml={onCancel ? 3 : 0}
              type="submit"
            >
              Login
            </FancyButton>
          </div>
        </form>
      )}
    </State>
  )
})
