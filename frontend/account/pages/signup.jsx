import React from "react"
import { withRouter } from "next/router"
import { TextInput } from "@dk3/ui/form/TextInput"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { MegaTitle, Description } from "@dk3/ui/atoms/Typography"
import { VeryFancyButton } from "@dk3/ui/form/Button"

export default withRouter(function Index() {
  return (
    <React.Fragment>
      <MegaTitle>Sign Up</MegaTitle>
      <Description>Create an account</Description>

      <CurrentUser>
        {({ isLoggedIn }) => {
          if (isLoggedIn) {
            return <div>Looks like you already have an account!</div>
          }

          return (
            <form>
              <TextInput placeholder="Email" type="email" label="Email" />
              <TextInput placeholder="Username" type="text" label="Username" />
              <TextInput
                placeholder="Password"
                type="password"
                label="Password"
              />
              <VeryFancyButton type="submit" mt={4} ph={5} pv={3}>
                Create your account
              </VeryFancyButton>
            </form>
          )
        }}
      </CurrentUser>
    </React.Fragment>
  )
})
