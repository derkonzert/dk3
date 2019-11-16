import React from "react"
import Link from "next/link"
import { Flex } from "@dk3/ui/atoms/Flex"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"
import { logout } from "@dk3/shared-frontend/lib/withApollo"
import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"

export const SideNavigation = () => (
  <HorizontalMenu>
    <Flex grow={1} justifyContent="space-between">
      <HorizontalMenuItem href="/">↩︎ Back to derkonzert</HorizontalMenuItem>
      <CurrentUser>
        {({ isLoggedIn }) => (
          <Flex justifyItems="flex-end">
            {isLoggedIn ? (
              <React.Fragment>
                <Link href="/" as="/account/" passHref>
                  <HorizontalMenuItem>Settings</HorizontalMenuItem>
                </Link>
                <Link href="/calendar" as="/account/calendar" passHref>
                  <HorizontalMenuItem>Calendar</HorizontalMenuItem>
                </Link>
                <HorizontalMenuItem
                  href="#"
                  onClick={async e => {
                    e.preventDefault()

                    await logout()

                    window.location.href = "/"
                  }}
                >
                  Logout
                </HorizontalMenuItem>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Link href="/login" as="/account/login" passHref>
                  <HorizontalMenuItem>Login</HorizontalMenuItem>
                </Link>
                <Link href="/signup" as="/account/signup" passHref>
                  <HorizontalMenuItem>Sign Up</HorizontalMenuItem>
                </Link>
              </React.Fragment>
            )}
          </Flex>
        )}
      </CurrentUser>
    </Flex>
  </HorizontalMenu>
)
