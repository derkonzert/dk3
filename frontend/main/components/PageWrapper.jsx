import React from "react"
import { Global } from "@emotion/core"
import { global } from "@dk3/ui/documentStyles"

import { MegaTitle } from "@dk3/ui/atoms/Typography"

export const PageWrapper = ({ children }) => (
  <React.Fragment>
    <MegaTitle>derkonzert</MegaTitle>
    <Global styles={global} />
    {children}
  </React.Fragment>
)
