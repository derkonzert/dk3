import React from "react"
import Link from "next/link"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"

export const HeaderMenu = () => (
  <CurrentUser>
    {({ isLoggedIn, loading }) => {
      if (loading) {
        return <Spinner />
      }

      return (
        <HorizontalMenu>
          {isLoggedIn ? (
            <Link href="/account/">
              <HorizontalMenuItem href="/account/">Account</HorizontalMenuItem>
            </Link>
          ) : (
            <React.Fragment>
              <Link href="/account/login">
                <HorizontalMenuItem href="/account/login">
                  Login
                </HorizontalMenuItem>
              </Link>
              <Link href="/account/signup">
                <HorizontalMenuItem href="/account/signup">
                  Sign Up
                </HorizontalMenuItem>
              </Link>
            </React.Fragment>
          )}
        </HorizontalMenu>
      )
    }}
  </CurrentUser>
)
