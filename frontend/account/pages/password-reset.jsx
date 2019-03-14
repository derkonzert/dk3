import React from "react"
import { TextInput } from "@dk3/ui/form/TextInput"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { MegaTitle, Description } from "@dk3/ui/atoms/Typography"
import { VeryFancyButton } from "@dk3/ui/form/Button"

export default function PasswordReset() {
  return (
    <React.Fragment>
      <MegaTitle>Password Reset</MegaTitle>
      <Description>Enter your email</Description>
      <CurrentUser>
        {({ isLoggedIn }) => {
          if (isLoggedIn) {
            return <div>Looks like you are already logged in</div>
          }

          return (
            <form>
              <TextInput placeholder="Email" type="email" label="Email" />

              <VeryFancyButton type="submit" ph={5} pv={3} mt={3}>
                Request a reset link
              </VeryFancyButton>
            </form>
          )
        }}
      </CurrentUser>
    </React.Fragment>
  )
}
