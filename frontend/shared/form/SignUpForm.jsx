import React from "react"
import { TextInput } from "@dk3/ui/form/TextInput"
import { State } from "react-powerplug"
import { FancyButton, Button } from "@dk3/ui/form/Button"
import { withApollo } from "react-apollo"
import { login } from "../lib/withApollo"

export const SignUpForm = withApollo(({ onSignUp, onCancel, client }) => {
  return (
    <State initial={{ username: "", email: "", password: "", message: "" }}>
      {({ state, setState }) => (
        <form
          onSubmit={async e => {
            e.preventDefault()

            const uri =
              process.env.NODE_ENV === "production"
                ? "/auth/signUp"
                : "http://localhost:8004/auth/signUp"

            try {
              const response = await fetch(uri, {
                method: "post",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: state.email,
                  username: state.username,
                  password: state.password,
                }),
              })

              const json = await response.json()

              if (json.message) {
                setState({
                  message: json.message,
                })
              }

              if (json.accessToken) {
                await login({ token: json.accessToken })

                await client.resetStore()
              }

              onSignUp && onSignUp()
            } catch (err) {
              setState({ message: err.message })
            }
          }}
        >
          {!!state.message && <span>{state.message}</span>}
          <TextInput
            label="Username"
            value={state.username}
            onChange={e => setState({ username: e.target.value })}
            name="username"
          />
          <TextInput
            label="E-Mail Address"
            value={state.email}
            onChange={e => setState({ email: e.target.value })}
            name="email"
            type="email"
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
            <FancyButton ml={onCancel ? 3 : 0} type="submit">
              Sign Up
            </FancyButton>
          </div>
        </form>
      )}
    </State>
  )
})
