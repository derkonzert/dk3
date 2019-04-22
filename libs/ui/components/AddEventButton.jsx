import React from "react"
import styled from "@emotion/styled"
import { gradientBackground } from "../common"

const Positioner = styled.div`
  display: flex;
  /* position: ${props => props.position || "fixed"}; */
  position: fixed;
  bottom: 5.5rem;
  left: 50%;
  transform: translateX(-50%);

  margin-top: 2rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  z-index: 1;

  @supports (position: sticky) {
    position: sticky;
    bottom: 5.5rem;
    left: 0;
    transform: none;
  }
`

const Wrapper = styled.a`
  display: inline-block;
  ${gradientBackground}
  border-radius: 50%;
  padding: 4px;
  box-shadow: 0 2px 3px ${({ theme }) => theme.colors.addEventButtonShadow};
  text-decoration: none;

  transition: 220ms transform;
  will-change: transform;

  user-drag: none;

  &:active {
    transform: scale(0.96);
  }
`

const Content = styled.div`
  display: inline-block;
  color: ${({ theme }) => theme.colors.text};
  height: 4rem;
  width: 4rem;
  font-size: 3.8rem;
  text-align: center;
  line-height: 0.95;
  font-weight: 100;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.boxBackground};
`

export const AddEventButton = ({ children, ...props }) => (
  <Positioner>
    <Wrapper {...props}>
      <Content>{children}</Content>
    </Wrapper>
  </Positioner>
)
