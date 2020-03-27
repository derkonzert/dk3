import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"

const Base = styled.div`
  font-size: 1.4rem;
  border-left: 0.6rem solid currentColor;
  text-align: left;
  border-radius: 2px;
`

export const Message = withSpacing({ pv: "s", ph: "m" })(styled(Base)`
  color: ${({ theme }) => theme.colors.messageColor};
  background-color: ${({ theme }) => theme.colors.messageBackground};
`)

export const SuccessMessage = withSpacing({ pv: "s", ph: "m" })(styled(Base)`
  color: ${({ theme }) => theme.colors.messageColorSuccess};
  background-color: ${({ theme }) => theme.colors.messageBackgroundSuccess};
`)

export const ErrorMessage = withSpacing({ pv: "s", ph: "m" })(styled(Base)`
  color: ${({ theme }) => theme.colors.messageColorError};
  background-color: ${({ theme }) => theme.colors.messageBackgroundError};
`)

export const WarningMessage = withSpacing({ pv: "s", ph: "m" })(styled(Base)`
  color: ${({ theme }) => theme.colors.messageColorWarning};
  background-color: ${({ theme }) => theme.colors.messageBackgroundWarning};
`)
