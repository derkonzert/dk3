import React from "react"

import Link from "next/link"

import { Link as UILink, ListTitle } from "@dk3/ui/atoms/Typography"

import { UpdateSelfForm } from "../components/UpdateSelfForm"

export default function Index({ isLoggedIn }) {
  return (
    <React.Fragment>
      <ListTitle>Settings</ListTitle>

      {isLoggedIn ? (
        <React.Fragment>
          <UpdateSelfForm />
        </React.Fragment>
      ) : (
        <Link href="login">
          <UILink>Please login</UILink>
        </Link>
      )}
    </React.Fragment>
  )
}
