import React from "react"

import { Description, ListTitle } from "@dk3/ui/atoms/Typography"

import { LoginForm } from "@dk3/shared-frontend/form/LoginForm"

export default function Index({ isLoggedIn }) {
  return (
    <React.Fragment>
      <ListTitle>Login</ListTitle>

      {isLoggedIn ? (
        <div>You are already logged in</div>
      ) : (
        <React.Fragment>
          <Description>Enter your credentials to sign in</Description>
          <LoginForm
            onLogin={() => {
              window.location.href = "/"
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}
