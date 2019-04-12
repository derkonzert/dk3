import React from "react"
import { Global } from "@emotion/core"
import styled from "@emotion/styled"

import { global } from "@dk3/ui/documentStyles"
import { Spacer } from "@dk3/ui/atoms/Spacer"

const PageContenWrapper = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 36rem;
  background: ${({ theme }) => theme.colors.boxBackground};
  padding: 1rem 3rem 3rem;
  text-align: center;
`

export const PageWrapper = ({ children }) => (
  <Spacer ma={5}>
    <Global styles={global} />
    <PageContenWrapper>{children}</PageContenWrapper>
  </Spacer>
)
