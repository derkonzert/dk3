/* TODO: Make UI component based on reach-ui */
import React from "react"
import { keyframes } from "@emotion/core"
import styled from "@emotion/styled"

const backgroundFadeIn = keyframes`
  from {
    background: rgba(0, 0, 0, 0);
  }

  to {
    background: rgba(0, 0, 0, 0.2);
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-3rem);
  }

  to {
    opacity: 1;
    transform: translateY(0rem);
  }
`

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: grid;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  z-index: 40;
  animation: 200ms ${backgroundFadeIn};
`

export const Container = styled.div`
  width: 100%;
  max-width: 35rem;

  background: white;
  border-radius: 0.6rem;
  padding: 1.5rem;

  animation: 200ms ${slideIn} 1 both;
  animation-delay: 200ms;
`

export const Dialog = ({ children }) => (
  <Overlay>
    <Container>{children}</Container>
  </Overlay>
)
