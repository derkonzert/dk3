import React from "react"
import { ErrorMessage } from "@dk3/ui/atoms/Message"
import { Spinner } from "@dk3/ui/atoms/Spinner"

import { CurrentUser } from "./CurrentUser"
import { hasSkill } from "./hasSkill"

export const withUserRole = (
  Component,
  { role, errorMessage = "You are not authorized to view this" }
) => {
  const ComponentWithUserRole = props => (
    <CurrentUser>
      {({ user, loading }) => {
        if (loading) {
          return <Spinner />
        }

        if (!user || !hasSkill(user, role)) {
          return <ErrorMessage>{errorMessage}</ErrorMessage>
        }

        return <Component {...props} />
      }}
    </CurrentUser>
  )

  ComponentWithUserRole.displayName = `withUserRole(${Component.displayName ||
    Component.name})`

  return ComponentWithUserRole
}
