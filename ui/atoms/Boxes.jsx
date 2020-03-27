import React from "react"
import { css } from "@emotion/core"
import styled from "@emotion/styled"
import { gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

const Outer = styled.div`
  padding: 3px;
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => theme.colors.boxBackground};

  ${props => props.fancyLevel >= 1 && gradientBackground(props)}

  ${props =>
    props.fancyLevel === 2 &&
    css`
      color: white;
    `}
`

export const BaseBox = withSpacing({ mv: "m" })(
  ({ children, fancyLevel = 0, ...props }) => (
    <Outer fancyLevel={fancyLevel} {...props}>
      {children}
    </Outer>
  )
)

export const Box = withSpacing({ mv: "m" })(({ ...props }) => (
  <BaseBox {...props} />
))

export const FancyBox = withSpacing({ mv: "m" })(({ ...props }) => (
  <BaseBox fancyLevel={1} {...props} />
))

export const SuperFancyBox = withSpacing({ mv: "m" })(({ ...props }) => (
  <BaseBox fancyLevel={2} {...props} />
))
