import React from "react"

import { TextInput } from "@dk3/ui/form/TextInput"

import { ListTitle, Description } from "@dk3/ui/atoms/Typography"
import { VeryFancyButton } from "@dk3/ui/form/Button"

export default function Index({ isLoggedIn }) {
  return (
    <React.Fragment>
      <ListTitle>Sign Up</ListTitle>
      <Description>Create an account</Description>
      {isLoggedIn ? (
        <div>Looks like you already have an account!</div>
      ) : (
        <form>
          <TextInput placeholder="Email" type="email" label="Email" />
          <TextInput placeholder="Username" type="text" label="Username" />
          <TextInput placeholder="Password" type="password" label="Password" />
          <VeryFancyButton type="submit" mt={4} ph={5} pv={3}>
            Create your account
          </VeryFancyButton>
        </form>
      )}
    </React.Fragment>
  )
}
