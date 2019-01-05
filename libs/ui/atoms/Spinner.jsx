import React from "react"
import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(359deg);
  }
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
  background-image: conic-gradient(
    from 40deg,
    rgb(255, 87, 87),
    #6a32cc,
    rgb(255, 87, 87)
  );

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

  background: #f9f9f9;
`

export const Spinner = () => (
  <Outer>
    <Inner />
  </Outer>
)
