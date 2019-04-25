import React from "react"
import Link from "next/link"
import { TextInput } from "@dk3/ui/form/TextInput"
import { Link as UILink, Small } from "@dk3/ui/atoms/Typography"
import { State } from "react-powerplug"
import { VeryFancyButton, Button } from "@dk3/ui/form/Button"
import { withApollo } from "react-apollo"
import { login } from "../lib/withApollo"
import { Spacer } from "@dk3/ui/atoms/Spacer"

export const LoginForm = withApollo(({ onLogin, onCancel, client }) => {
  return (
    <State initial={{ email: "", password: "", message: "", loading: false }}>
      {({ state, setState }) => (
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
                  login({ token: data.accessToken, lastLogin: data.lastLogin })

                  return Promise.all([data, client.resetStore()])
                }

                throw new Error("Please try again")
              })
              .then(([data]) => {
                if (data.lastLogin) {
                  onLogin && onLogin(data)
                } else {
                  // User logged in for the first time
                  window.location.href = "/account/setup"
                }
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
            description={
              <Link href="/account/password">
                <a>Forgot?</a>
              </Link>
            }
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
            <VeryFancyButton
              disabled={state.loading}
              ml={onCancel ? 3 : 0}
              type="submit"
            >
              Login
            </VeryFancyButton>
          </div>
          <Spacer mt={3}>
            <Link href="/account/signup">
              <UILink>
                <Small>{"I don't have an account yet"}</Small>
              </UILink>
            </Link>
          </Spacer>
        </form>
      )}
    </State>
  )
})
