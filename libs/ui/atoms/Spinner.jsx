import React from "react"
import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"
import { gradientBackground } from "../common"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
`

const Spacer = styled.div`
  width: 100%;
  text-align: center;
`

const Outer = styled.div`
  position: relative;
  display: inline-block;
  margin: 0 0.5rem;
  vertical-align: middle;

  border-radius: 50%;
  width: 2em;
  height: 2em;

  box-sizing: border-box;
  /* Fallback for browsers not supporting conic-gradient */
  ${gradientBackground}
  ${({ theme }) => `background-image: conic-gradient(
    from 40deg,
    ${theme.colors.mainGradientFrom},
    ${theme.colors.mainGradientTo},
    ${theme.colors.mainGradientFrom}
  );`}

  animation: ${rotate} 0.5s linear infinite;
`

const Inner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  border-radius: 50%;
  height: 1.6em;
  width: 1.6em;

  background: ${({ theme }) => theme.colors.siteBackground};
`

export const Spinner = withSpacing({ pa: 4 })(props => (
  <Spacer {...props}>
    <Outer>
      <Inner />
    </Outer>
  </Spacer>
))
