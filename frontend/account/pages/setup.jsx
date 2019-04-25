import React from "react"

import Link from "next/link"

import { Link as UILink } from "@dk3/ui/atoms/Typography"

import { AccountSetupForm } from "../components/AccountSetupForm"

export default function Setup({ isLoggedIn }) {
  return (
    <React.Fragment>
      {isLoggedIn ? (
        <AccountSetupForm />
      ) : (
        <Link href="/login" as="/account/login" passHref>
          <UILink>Please login</UILink>
        </Link>
      )}
    </React.Fragment>
  )
}
