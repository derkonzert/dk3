import React from "react"

import Link from "next/link"

import { Hr, Link as UILink, ListTitle, Text } from "@dk3/ui/atoms/Typography"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"

import { UpdateSelfForm } from "../components/UpdateSelfForm"

export default function Index({ isLoggedIn }) {
  return (
    <SentryErrorBoundary>
      <ListTitle mb={3}>Settings</ListTitle>

      {isLoggedIn ? (
        <React.Fragment>
          <Text mv={3}>
            This is the place for all available account settings, so you can
            adjust derkonzert to the way you like it.
          </Text>
          <Hr mv={4} />
          <UpdateSelfForm />
        </React.Fragment>
      ) : (
        <Link href="/login" as="/account/login" passHref>
          <UILink>Please login</UILink>
        </Link>
      )}
    </SentryErrorBoundary>
  )
}
