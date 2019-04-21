import React from "react"
import Link from "next/link"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"

const HorizontalMenuItemInfo = HorizontalMenuItem.withComponent("span")

export const HeaderMenu = () => (
  <CurrentUser>
    {({ isLoggedIn, loading, user }) => {
      if (loading) {
        return <Spinner />
      }

      return (
        <HorizontalMenu>
          {isLoggedIn ? (
            <React.Fragment>
              <HorizontalMenuItemInfo>
                Hi {user.username}
              </HorizontalMenuItemInfo>
              <Link href="/?addEvent=1" as="/add-new-event" passHref>
                <HorizontalMenuItem>Add Event</HorizontalMenuItem>
              </Link>
              <Link href="/account/" passHref>
                <HorizontalMenuItem>Account</HorizontalMenuItem>
              </Link>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Link href="/?addEvent=1" as="/add-new-event" passHref>
                <HorizontalMenuItem>Add Event</HorizontalMenuItem>
              </Link>
              <Link href="/account/login" passHref>
                <HorizontalMenuItem>Login</HorizontalMenuItem>
              </Link>
              <Link href="/account/signup" passHref>
                <HorizontalMenuItem>Sign Up</HorizontalMenuItem>
              </Link>
            </React.Fragment>
          )}
        </HorizontalMenu>
      )
    }}
  </CurrentUser>
)
