import styled from "@emotion/styled"
import css from "@emotion/css"

import { rgba } from "../theme/rgba"

export const VerticalMenu = styled.nav`
  margin: 0;
  padding: 0;
`

export const VerticalMenuItem = styled.a`
  display: block;

  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  font-size: 1.2rem;
  font-family: "IBM Plex Serif", serif;
  text-decoration: none;

  border-radius: 2px;

  ${({ isActive, theme }) =>
    isActive
      ? css`
          background-color: ${theme.colors.verticalMenuBgColor};
          color: ${theme.colors.verticalMenuActiveColor};
        `
      : css`
          background-color: ${rgba(theme.colors.verticalMenuBgColor, 0.5)};
          color: ${theme.colors.verticalMenuColor};
        `}
`
