import React, { useState } from "react"
import Link from "next/link"

import { CurrentUser } from "../../lib/CurrentUser"

import {
  HorizontalMenu,
  HorizontalMenuItem,
} from "@dk3/ui/components/HorizontalMenu"
import { LoginDialog } from "../form/LoginDialog"

const HorizontalMenuItemInfo = HorizontalMenuItem.withComponent("span")

export const HeaderMenu = () => {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <React.Fragment>
      <HorizontalMenu data-main-nav>
        <CurrentUser>
          {({ isLoggedIn, user }) => {
            return isLoggedIn ? (
              <HorizontalMenuItemInfo>
                Hi {user.username}
              </HorizontalMenuItemInfo>
            ) : (
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
            )
          }}
        </CurrentUser>
        <Link href="/?addEvent=1" as="/add-new-event" passHref>
          <HorizontalMenuItem>Add Event</HorizontalMenuItem>
        </Link>
        <Link href="/account" passHref>
          <HorizontalMenuItem>Account</HorizontalMenuItem>
        </Link>
      </HorizontalMenu>

      <LoginDialog
        isOpen={showLogin}
        title="Login"
        onLogin={() => setShowLogin(false)}
        onCancel={() => setShowLogin(false)}
      />
    </React.Fragment>
  )
}
