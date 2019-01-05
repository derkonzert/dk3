import React from "react"
import { Global } from "@emotion/core"
import { global } from "../global"

export default function Wrapper({ children }) {
  return (
    <React.Fragment>
      <Global styles={global} />
      {children}
    </React.Fragment>
  )
}
