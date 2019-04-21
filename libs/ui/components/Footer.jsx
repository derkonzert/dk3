import styled from "@emotion/styled"

import { withSpacing } from "../utils/withSpacing"

export const Footer = withSpacing({ pt: 5, pb: 6, ph: 3 })(styled.footer`
  background: linear-gradient(
    ${({ theme }) => theme.colors.siteBackground},
    ${({ theme }) => theme.colors.detailBackground}
  );
`)

export const FooterLink = styled.a`
  color: inherit;
  font-family: "IBM Plex Mono", monospace;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.35;
`
