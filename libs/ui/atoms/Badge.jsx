import styled from "@emotion/styled"

export const Badge = styled.span`
  margin-right: 0.4rem;
  font-weight: 600;
`

export const RedBadge = styled(Badge)`
  color: ${props =>
    props.inverted
      ? props.theme.colors.titleInverted
      : props.theme.colors.redBadge};
`

export const GreenBadge = styled(Badge)`
  color: ${props =>
    props.inverted
      ? props.theme.colors.titleInverted
      : props.theme.colors.greenBadge};
`
