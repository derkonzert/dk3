import React from "react"
import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"
import { gradientBackground } from "../common"

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(270deg))
  }

  50% {
    transform: rotate(540deg);
  }
  
  75% {
    border-radius: 2px;
    transform: rotate(810deg);
  }

  100% {
    transform: rotate(1080deg);
  }
`

const zoom = keyframes`
  0% {
    transform: scale(0.65);
  }

  25% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.45);
  }

  75% {
    border-radius: 2px;
    transform: scale(0.85);
  }

  100% {
    transform: scale(0.65);
  }
`

const Spacer = styled.div`
  width: 100%;
  text-align: center;
`

const Outer = styled.div`
  position: relative;
  display: inline-block;
  padding: 4px;
  vertical-align: middle;

  border-radius: 50%;
  width: 32px;
  height: 32px;

  box-sizing: border-box;
  /* Fallback for browsers not supporting conic-gradient */
  ${gradientBackground}
  ${({ theme }) => `background-image: conic-gradient(
    from 40deg,
    ${theme.colors.mainGradientFrom},
    ${theme.colors.mainGradientTo},
    ${theme.colors.mainGradientFrom}
  );`}

  animation: ${rotate} 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
`

const Inner = styled.div`
  border-radius: 50%;
  height: 100%;
  width: 100%;

  background: ${({ theme }) => theme.colors.siteBackground};

  animation: ${zoom} 4.4s cubic-bezier(0, 0, 0.2, 1) infinite;
`

export const Spinner = withSpacing({ pa: 4 })(props => (
  <Spacer {...props}>
    <Outer>
      <Inner />
    </Outer>
  </Spacer>
))
