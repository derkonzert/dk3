import React from "react"

import { VerticalMenu, VerticalMenuItem } from "@dk3/ui/components/VerticalMenu"
import { logout } from "../lib/withApollo"
import { CurrentUser } from "./CurrentUser"
import { ActiveLink } from "./ActiveLink"

export const SideNavigation = () => (
  <VerticalMenu>
    <VerticalMenuItem href="/">↩︎ Back to derkonzert</VerticalMenuItem>
    <CurrentUser>
      {({ isLoggedIn }) =>
        isLoggedIn ? (
          <React.Fragment>
            <ActiveLink href="/account" passHref>
              <VerticalMenuItem>Settings</VerticalMenuItem>
            </ActiveLink>
            <ActiveLink href="/account/calendar" passHref>
              <VerticalMenuItem>Calendar</VerticalMenuItem>
            </ActiveLink>
            <VerticalMenuItem
              href="#"
              onClick={async e => {
                e.preventDefault()

                await logout()

                window.location.href = "/"
              }}
            >
              Logout
            </VerticalMenuItem>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <ActiveLink href="/account/login" passHref>
              <VerticalMenuItem>Login</VerticalMenuItem>
            </ActiveLink>
            <ActiveLink href="/account/signup" passHref>
              <VerticalMenuItem>Sign Up</VerticalMenuItem>
            </ActiveLink>
          </React.Fragment>
        )
      }
    </CurrentUser>
  </VerticalMenu>
)
