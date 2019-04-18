import React from "react"

import Link from "next/link"

import { Hr, Link as UILink, ListTitle, Text } from "@dk3/ui/atoms/Typography"

import { UpdateSelfForm } from "../components/UpdateSelfForm"

export default function Index({ isLoggedIn }) {
  return (
    <React.Fragment>
      <ListTitle>Settings</ListTitle>

      {isLoggedIn ? (
        <React.Fragment>
          <Text mv={3}>
            This is the place for all available account settings, so you can
            adjust derkonzert to the way you like it.
          </Text>
          <Hr />
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
