import React, { useState, useEffect } from "react"

import Link from "next/link"
import { withRouter } from "next/router"
import { ListTitle, Text, Strong } from "@dk3/ui/atoms/Typography"

import { Spinner } from "@dk3/ui/atoms/Spinner"
import { VeryFancyLink } from "@dk3/ui/form/Button"
import { SentryErrorBoundary } from "@dk3/shared-frontend/lib/SentryErrorBoundary"

const SignUpActivate = withRouter(function SignUpActivate({ router }) {
  const [status, setStatus] = useState("fetching")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function checkDoiToken() {
      const uri =
        process.env.NODE_ENV === "production"
          ? "/auth/verify-email"
          : "http://localhost:8004/auth/verify-email"

      try {
        const response = await fetch(uri, {
          method: "post",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            token: router.query.token,
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
        setStatus("error")
        setMessage(err.message)
      }
    }

    checkDoiToken()
  }, [])

  return (
    <React.Fragment>
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
    </React.Fragment>
  )
})

export default function Activate(props) {
  return (
    <SentryErrorBoundary>
      <SignUpActivate {...props} />
    </SentryErrorBoundary>
  )
}
