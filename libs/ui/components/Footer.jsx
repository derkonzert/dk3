import styled from "@emotion/styled"

import { withSpacing } from "../utils/withSpacing"

export const Footer = withSpacing({ pt: 5, pb: 6, ph: 3 })(styled.footer`
  background: linear-gradient(
    ${({ theme }) => theme.colors.siteBackground},
    ${({ theme }) => theme.colors.detailBackground}
  );
`)
