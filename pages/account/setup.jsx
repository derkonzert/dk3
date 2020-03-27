import React from "react"

import Link from "next/link"
import { Link as UILink } from "@dk3/ui/atoms/Typography"

import { AccountSetupForm } from "../../components/AccountSetupForm"
import { PageWrapper } from "../../components/PageWrapper"

import { SentryErrorBoundary } from "../../components/SentryErrorBoundary"
import { CurrentUser } from "../../components/CurrentUser"

export default function Setup() {
  return (
    <SentryErrorBoundary>
      <PageWrapper>
        <CurrentUser>
          {({ isLoggedIn }) =>
            isLoggedIn ? (
              <AccountSetupForm />
            ) : (
              <Link href="/login" as="/account/login" passHref>
                <UILink>Please login</UILink>
              </Link>
            )
          }
        </CurrentUser>
      </PageWrapper>
    </SentryErrorBoundary>
  )
}
