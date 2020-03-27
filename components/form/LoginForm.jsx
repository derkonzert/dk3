import React from "react"
import Link from "next/link"
import styled from "@emotion/styled"
import { State } from "react-powerplug"
import { withApollo } from "react-apollo"

import { TextInput } from "@dk3/ui/form/TextInput"
import { Link as UILink, Small } from "@dk3/ui/atoms/Typography"
import { VeryFancyButton, Button } from "@dk3/ui/form/Button"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Spinner } from "@dk3/ui/atoms/Spinner"

import { login } from "../../lib/withApollo"

const Form = styled.form`
  position: relative;
  max-width: 35rem;
`

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 4.5rem 0;
  background: ${({ theme }) => theme.colors.formLoadingOverlay};
`

export const LoginForm = withApollo(({ onLogin, onCancel, client }) => {
  return (
    <State initial={{ email: "", password: "", message: "", loading: false }}>
      {({ state, setState }) => (
        <Form
          onSubmit={e => {
            setState({ loading: true })
            e.preventDefault()

            const uri = "/api/auth/signIn"

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
                  login({
                    token: data.accessToken,
                    lastLogin: data.lastLogin,
                    expiresAt: data.expiresAt,
                  })

                  return Promise.all([data, client.resetStore()])
                }

                throw new Error("Please try again")
              })
              .then(([data]) => {
                onLogin && onLogin(data)

                if (!data.lastLogin) {
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
            disabled={state.loading}
          />
          <TextInput
            label="Password"
            description={
              <Link href="/account/password">
                <a>{"Can't remember?"}</a>
              </Link>
            }
            value={state.password}
            onChange={e => setState({ password: e.target.value })}
            type="password"
            name="password"
            disabled={state.loading}
          />
          <div style={{ display: "flex" }}>
            {!!onCancel && (
              <Button
                disabled={state.loading}
                type="button"
                mr="m"
                onClick={onCancel}
              >
                Cancel
              </Button>
            )}
            <VeryFancyButton
              disabled={state.loading}
              ml={onCancel ? "m" : "none"}
              type="submit"
            >
              Login
            </VeryFancyButton>
          </div>
          <Spacer mt="m" style={{ textAlign: "center" }}>
            <Link href="/account/signup">
              <UILink>
                <Small>{"I don't have an account yet"}</Small>
              </UILink>
            </Link>
          </Spacer>
          {state.loading && (
            <LoadingOverlay>
              <Spinner />
            </LoadingOverlay>
          )}
        </Form>
      )}
    </State>
  )
})
