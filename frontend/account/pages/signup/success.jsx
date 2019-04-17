import React from "react"

import { ListTitle, Strong, Text } from "@dk3/ui/atoms/Typography"

export default function SignUpSuccess() {
  return (
    <React.Fragment>
      <ListTitle>🎉 Success!</ListTitle>

      <Text mb={4}>
        We created your account and sent you and{" "}
        <Strong>activation email</Strong>. Now it is your turn, to go check your
        E-Mails and open that activation link.
      </Text>

      <Text mb={3}>
        It may take up to 5 minutes to send you this email.
        <br />
        And please also check your spam.
      </Text>
    </React.Fragment>
  )
}
