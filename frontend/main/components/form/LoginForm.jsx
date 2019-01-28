import React from "react"
import { TextInput } from "@dk3/ui/form/TextInput"
import { State } from "react-powerplug"
import { FancyButton, Button } from "@dk3/ui/form/Button"
import { withApollo } from "react-apollo"

export const LoginForm = withApollo(props => {
  return (
    <State initial={{ email: "", password: "", message: "" }}>
      {({ state, setState, resetState }) => (
        <form
          onSubmit={e => {
            e.preventDefault()

            fetch("http://localhost:8004/auth/signIn", {
              method: "post",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                email: state.email,
                password: state.password,
              }),
            })
              .then(resp => resp.json())
              .then(data => {
                if (data.message) {
                  setState({
                    message: data.message,
                  })
                }

                if (data.accessToken) {
                  localStorage.setItem("accessToken", data.accessToken)

                  props.client.resetStore()
                }

                resetState()
              })
              .catch(err => {
                setState({ message: err.message })
              })
          }}
        >
          {!!state.message && <span>{state.message}</span>}
          <TextInput
            value={state.email}
            onChange={e => setState({ email: e.target.value })}
            name="email"
          />
          <TextInput
            value={state.password}
            onChange={e => setState({ password: e.target.value })}
            type="password"
            name="password"
          />
          <FancyButton type="submit">Login</FancyButton>
          {"localStorage" in global && !!localStorage.accessToken && (
            <Button
              onClick={() => {
                localStorage.removeItem("accessToken")
                props.client.resetStore()
              }}
            >
              Logout
            </Button>
          )}
        </form>
      )}
    </State>
  )
})
