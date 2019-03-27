import React from "react"
import { TextInput } from "@dk3/ui/form/TextInput"

import { MegaTitle, Description } from "@dk3/ui/atoms/Typography"
import { VeryFancyButton } from "@dk3/ui/form/Button"

export default function PasswordReset({ isLoggedIn }) {
  return (
    <React.Fragment>
      <MegaTitle>Password Reset</MegaTitle>
      <Description>Enter your email</Description>

      {isLoggedIn ? (
        <div>Looks like you are already logged in</div>
      ) : (
        <form>
          <TextInput placeholder="Email" type="email" label="Email" />

          <VeryFancyButton type="submit" ph={5} pv={3} mt={3}>
            Request a reset link
          </VeryFancyButton>
        </form>
      )}
    </React.Fragment>
  )
}
