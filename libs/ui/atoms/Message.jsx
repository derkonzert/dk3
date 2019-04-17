import styled from "@emotion/styled"
import { withSpacing } from "../utils/withSpacing"

const Base = styled.div`
  font-size: 1.4rem;
  border-left: 0.6rem solid currentColor;
  text-align: left;
  border-radius: 2px;
`

export const Message = withSpacing({ pv: 2, ph: 3 })(styled(Base)`
  color: ${({ theme }) => theme.colors.messageColor};
  background-color: ${({ theme }) => theme.colors.messageBackground};
`)

export const ErrorMessage = withSpacing({ pv: 2, ph: 3 })(styled(Base)`
  color: ${({ theme }) => theme.colors.errorMessageColor};
  background-color: ${({ theme }) => theme.colors.errorMessageBackground};
`)
