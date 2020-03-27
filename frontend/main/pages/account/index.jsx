import React from "react"

import Link from "next/link"

import { Hr, Link as UILink, ListTitle, Text } from "@dk3/ui/atoms/Typography"
import { Spacer } from "@dk3/ui/atoms/Spacer"

import { UpdateSelfForm } from "../../components/UpdateSelfForm"
import { PageWrapper } from "../../components/PageWrapper"

import { SentryErrorBoundary } from "../../lib/SentryErrorBoundary"
import { CurrentUser } from "../../lib/CurrentUser"

export default function Index() {
  return (
    <SentryErrorBoundary>
      <PageWrapper>
        <Spacer pa="m">
          <ListTitle mb="m">Settings</ListTitle>
          <CurrentUser>
            {({ isLoggedIn }) =>
              isLoggedIn ? (
                <React.Fragment>
                  <Text mv="m">
                    This is the place for all available account settings, so you
                    can adjust derkonzert to the way you like it.
                  </Text>
                  <Hr mv="l" />
                  <UpdateSelfForm />
                </React.Fragment>
              ) : (
                <Link href="/login" as="/account/login" passHref>
                  <UILink>Please login</UILink>
                </Link>
              )
            }
          </CurrentUser>
        </Spacer>
      </PageWrapper>
    </SentryErrorBoundary>
  )
}
