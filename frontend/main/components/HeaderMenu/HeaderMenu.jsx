import React, { useState } from "react"
import Link from "next/link"

import { CurrentUser } from "@dk3/shared-frontend/lib/CurrentUser"
import { Spinner } from "@dk3/ui/atoms/Spinner"
import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"
import { LoginDialog } from "@dk3/shared-frontend/form/LoginDialog"

const HorizontalMenuItemInfo = HorizontalMenuItem.withComponent("span")

export const HeaderMenu = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <React.Fragment>
      <CurrentUser>
        {({ isLoggedIn, loading, user }) => {
          if (loading) {
            return <Spinner />
          }

          return (
            <HorizontalMenu data-main-nav>
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
                    <HorizontalMenuItem
                      onClick={e => {
                        e.preventDefault()
                        setShowLogin(true)
                      }}
                    >
                      Login
                    </HorizontalMenuItem>
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

      <LoginDialog
        isOpen={showLogin}
        title="Login"
        onLogin={() => setShowLogin(false)}
        onCancel={() => setShowLogin(false)}
      />
    </React.Fragment>
  )
}
