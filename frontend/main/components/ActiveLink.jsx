import Link from "next/link"
import { withRouter } from "next/router"
import { Children } from "react"
import React from "react"

export const ActiveLink = withRouter(
  ({ router, children, as, href, ...rest }) => (
    <Link {...rest} href={href} as={as}>
      {React.cloneElement(Children.only(children), {
        isActive: router.asPath === href || router.asPath === as,
      })}
    </Link>
  )
)
