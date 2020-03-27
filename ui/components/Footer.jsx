import styled from "@emotion/styled"

import { withSpacing } from "../utils/withSpacing"
import { Checkbox } from "../form/Checkbox"

export const Footer = withSpacing({
  pt: "xl",
  pb: "xxl",
  ph: "m",
})(styled.footer`
  background: linear-gradient(
    ${({ theme }) => theme.colors.siteBackground},
    ${({ theme }) => theme.colors.detailBackground}
  );
`)

export const FooterLink = styled.a`
  color: inherit;
  font-family: "IBM Plex Serif", serif;
  font-weight: normal;
  font-size: 1.2rem;
  line-height: 1.35;
  text-underline-position: under;
`

export const FooterCheckbox = styled(Checkbox)`
  label {
    font-family: "IBM Plex Serif", serif;
    text-decoration: underline;
    text-underline-position: under;
  }
`
