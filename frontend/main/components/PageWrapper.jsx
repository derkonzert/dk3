import React from "react"
import { Global } from "@emotion/core"
import { global } from "@dk3/ui/documentStyles"

export const PageWrapper = ({ children }) => (
  <React.Fragment>
    <Global styles={global} />
    {children}
  </React.Fragment>
)
