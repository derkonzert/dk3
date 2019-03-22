import styled from "@emotion/styled"

export const Badge = styled.span`
  margin-right: 0.4rem;
  font-weight: 600;
`

export const RedBadge = styled(Badge)`
  color: ${props => (props.inverted ? "white" : "rgb(228, 17, 17)")};
`

export const GreenBadge = styled(Badge)`
  color: ${props => (props.inverted ? "white" : "rgb(13, 132, 46)")};
`
