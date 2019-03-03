import styled from "@emotion/styled"

export const Header = styled.header`
  padding: 10.6rem 2rem 1.4rem;
  transition: 200ms padding-top;
  will-change: padding-top;
  ${props => (props.loggedIn ? "padding-top: 1.4rem" : "")}
`
