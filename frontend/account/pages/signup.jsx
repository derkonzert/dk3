import React from "react"

import { ListTitle, Description } from "@dk3/ui/atoms/Typography"

import { SignUpForm } from "@dk3/shared-frontend/form/SignUpForm"

export default function Index({ isLoggedIn }) {
  return (
    <React.Fragment>
      <ListTitle>Sign Up</ListTitle>
      <Description>Create an account</Description>
      {isLoggedIn ? (
        <div>Looks like you already have an account!</div>
      ) : (
        <SignUpForm />
      )}
    </React.Fragment>
  )
}
