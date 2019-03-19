import React from "react"
import { withRouter } from "next/router"
import Link from "next/link"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { Spinner } from "@dk3/ui/atoms/Spinner"

import {
  Description,
  Link as UILink,
  ListTitle,
} from "@dk3/ui/atoms/Typography"

import { LoginForm } from "@dk3/shared-frontend/form/LoginForm"

export default withRouter(function Index({ router }) {
  return (
    <React.Fragment>
      <ListTitle>Login</ListTitle>
      <CurrentUser>
        {({ isLoggedIn, loading }) => {
          if (isLoggedIn) {
            return <div>You are already logged in</div>
          }

          if (loading) {
            return <Spinner />
          }

          return (
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
          )
        }}
      </CurrentUser>
    </React.Fragment>
  )
})
