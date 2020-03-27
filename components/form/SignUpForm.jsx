import React, { useState } from "react"
import { withApollo } from "react-apollo"
import styled from "@emotion/styled"

import { TextInput } from "@dk3/ui/form/TextInput"
import { VeryFancyButton, Button } from "@dk3/ui/form/Button"

import { useUniquenessCheck } from "../../lib/useUniquenessCheck"

const uriBase = "/"

const Form = styled.form`
  max-width: 35rem;
`

export const SignUpForm = withApollo(({ onSignUp, onCancel }) => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    message: "",
  })
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    message: "",
  })
  const [usernameIsUnique, usernameIsChecking] = useUniquenessCheck(
    formState.username,
    `${uriBase}api/auth/unique-username`
  )
  const [emailIsUnique, emailIsChecking] = useUniquenessCheck(
    formState.email,
    `${uriBase}api/auth/unique-email`
  )

  return (
    <Form
      onSubmit={async e => {
        e.preventDefault()

        const { email, username, password } = formState

        const formErrors = []

        if (!email.trim()) {
          formErrors.push(["email", "E-Mail can't be blank"])
        }
        if (!username.trim()) {
          formErrors.push(["username", "Username can't be blank"])
        }
        if (!password.trim()) {
          formErrors.push(["password", "Password can't be blank"])
        }

        if (formErrors.length) {
          setFormErrors(
            formErrors.reduce(
              (errors, fieldError) => ({
                ...errors,
                [fieldError[0]]: fieldError[1],
              }),
              {}
            )
          )
          return
        }

        setFormErrors({})

        const uri = `${uriBase}api/auth/signUp`

        try {
          const response = await fetch(uri, {
            method: "post",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email,
              username,
              password,
            }),
          })

          const json = await response.json()

          if (json.message) {
            setFormState({ ...formState, message: json.message })
          }

          if (json.success) {
            onSignUp && onSignUp()
          }
        } catch (err) {
          setFormState({ ...formState, message: err.message })
        }
      }}
    >
      {!!formState.message && <span>{formState.message}</span>}
      <TextInput
        label="Username"
        value={formState.username}
        error={
          usernameIsUnique === false
            ? "Someone already uses this username."
            : formErrors.username
        }
        onChange={e =>
          setFormState({
            ...formState,
            username: e.target.value.toLowerCase().trim(),
          })
        }
        name="username"
        withSpinner={usernameIsChecking}
      />
      <TextInput
        label="E-Mail Address"
        value={formState.email}
        error={
          emailIsUnique === false
            ? "It looks like, you already have an account?"
            : formErrors.email
        }
        onChange={e => setFormState({ ...formState, email: e.target.value })}
        name="email"
        type="email"
        withSpinner={emailIsChecking}
      />
      <TextInput
        label="Password"
        value={formState.password}
        error={formErrors.password}
        onChange={e => setFormState({ ...formState, password: e.target.value })}
        type="password"
        name="password"
      />
      <div style={{ display: "flex" }}>
        {!!onCancel && (
          <Button type="button" mr="m" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <VeryFancyButton ml={onCancel ? "m" : "none"} type="submit">
          Create Account
        </VeryFancyButton>
      </div>
    </Form>
  )
})
