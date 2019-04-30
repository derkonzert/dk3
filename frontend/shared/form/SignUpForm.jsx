import React, { useState } from "react"
import { TextInput } from "@dk3/ui/form/TextInput"
import { FancyButton, Button } from "@dk3/ui/form/Button"
import { withApollo } from "react-apollo"

import { useUniquenessCheck } from "../lib/useUniquenessCheck"

const uriBase =
  process.env.NODE_ENV === "production" ? "/" : "http://localhost:8004/"

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
    `${uriBase}auth/unique-username`
  )
  const [emailIsUnique, emailIsChecking] = useUniquenessCheck(
    formState.email,
    `${uriBase}auth/unique-email`
  )

  return (
    <form
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

        const uri = `${uriBase}auth/signUp`

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
          <Button type="button" mr={3} onClick={onCancel}>
            Cancel
          </Button>
        )}
        <FancyButton ml={onCancel ? 3 : 0} type="submit">
          Sign Up
        </FancyButton>
      </div>
    </form>
  )
})
