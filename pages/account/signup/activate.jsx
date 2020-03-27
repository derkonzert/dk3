import React, { useState, useEffect } from "react"

import Link from "next/link"

import { ListTitle, Text, Strong } from "@dk3/ui/atoms/Typography"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { VeryFancyLink } from "@dk3/ui/form/Button"
import { SentryErrorBoundary } from "../../../components/SentryErrorBoundary"
import { PageWrapper } from "../../../components/PageWrapper"
import { Sentry } from "../../../components/Sentry"

const getVerificationTokenFromUrl = href => {
  const url = new URL(href)
  return url.searchParams.get("token")
}

const SignUpActivate = function SignUpActivate() {
  const [status, setStatus] = useState("fetching")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkDoiToken() {
      const uri = "/api/auth/verify-email"

      let token

      try {
        token = getVerificationTokenFromUrl(location.href)

        if (!token) {
          throw new Error(
            "Parsing URL for activation failed: no token returned"
          )
        }
      } catch (err) {
        Sentry.captureException(err)
      }

      try {
        const response = await fetch(uri, {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token,
          }),
        })

        if (response.status === 400) {
          throw new Error("Token is no longer valid")
        }

        if (response.status !== 200) {
          throw new Error("Something weird happened. Please try again")
        }

        setStatus("success")
      } catch (err) {
        Sentry.captureException(err)

        setStatus("error")
        setMessage(err.message)
      }
    }

    checkDoiToken()
  }, [])

  return (
    <PageWrapper>
      <ListTitle>Activating Account</ListTitle>
      {status === "error" && <Strong>{message}</Strong>}
      {status === "fetching" && (
        <React.Fragment>
          <Text>This should not take long</Text>
          <Spinner />
        </React.Fragment>
      )}
      {status === "success" && (
        <React.Fragment>
          <Text mb="l">
            Congratulations,
            <br />
            your account is now ready to use!
          </Text>
          <Link href="/account/login" passHref>
            <VeryFancyLink>{"Let's Login"}</VeryFancyLink>
          </Link>
        </React.Fragment>
      )}
    </PageWrapper>
  )
}

export default function Activate(props) {
  return (
    <SentryErrorBoundary>
      <SignUpActivate {...props} />
    </SentryErrorBoundary>
  )
}
