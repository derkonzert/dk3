import React from "react"
import { Global } from "@emotion/core"
import styled from "@emotion/styled"

import { global } from "@dk3/ui/documentStyles"
import { withSpacing } from "@dk3/ui/utils/withSpacing"

export const PageContenWrapper = withSpacing({ mv: 5 })(styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 36rem;
  background: ${({ theme }) => theme.colors.boxBackground};
  padding: 1rem 3rem 4rem;
  text-align: center;
  align-self: flex-start;
  overflow: hidden;
`)

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-content auto min-content;
  min-height: 100vh;
`

export const PageWrapper = ({ children }) => (
  <Wrapper>
    <Global styles={global} />
    {children}
  </Wrapper>
)
