import React from "react"
import styled from "@emotion/styled"
import { gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

const BoxBase = styled.div`
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.colors.boxBackground};
`

const BoxBaseInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;

  padding: 0;
`

const FancyBoxBase = styled(BoxBase)`
  ${gradientBackground};
`

const FancyBoxBaseInner = styled(BoxBaseInner)`
  background-color: ${({ theme }) => theme.colors.boxBackground};
`

const SuperFancyBoxBase = styled(BoxBase)`
  ${gradientBackground};
  color: white;
`

export const Box = withSpacing({ mv: 3 })(({ children, ...props }) => (
  <BoxBase {...props}>
    <BoxBaseInner>{children}</BoxBaseInner>
  </BoxBase>
))

export const FancyBox = withSpacing({ mv: 3 })(({ children, ...props }) => (
  <FancyBoxBase {...props}>
    <FancyBoxBaseInner>{children}</FancyBoxBaseInner>
  </FancyBoxBase>
))

export const SuperFancyBox = withSpacing({ mv: 3 })(
  ({ children, ...props }) => (
    <SuperFancyBoxBase {...props}>
      <BoxBaseInner>{children}</BoxBaseInner>
    </SuperFancyBoxBase>
  )
)
