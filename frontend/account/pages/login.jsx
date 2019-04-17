import React from "react"
import { withRouter } from "next/router"

import { Description, ListTitle } from "@dk3/ui/atoms/Typography"

import { LoginForm } from "@dk3/shared-frontend/form/LoginForm"

export default withRouter(function Index({ router, isLoggedIn }) {
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
              router.go("/")
            }}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
})
