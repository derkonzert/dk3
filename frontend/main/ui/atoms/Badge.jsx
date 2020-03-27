import styled from "@emotion/styled"

export const Badge = styled.span`
  margin-right: 0.4rem;
  font-weight: 600;
`

export const DangerBadge = styled(Badge)`
  color: ${props =>
    props.inverted
      ? props.theme.colors.dangerBadgeInverted
      : props.theme.colors.dangerBadge};
`

export const SuccessBadge = styled(Badge)`
  color: ${props =>
    props.inverted
      ? props.theme.colors.successBadgeInverted
      : props.theme.colors.successBadge};
`
