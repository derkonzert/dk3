import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"

import {
  Description,
  Link as UILink,
  ListTitle,
} from "@dk3/ui/atoms/Typography"

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
          <Link href="signup">
            <UILink>Create an account</UILink>
          </Link>
        </React.Fragment>
      )}
    </React.Fragment>
  )
})
