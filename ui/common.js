/* common styles */
import { css } from "@emotion/core"

export const gradientBackground = ({ theme }) => css`
  background: linear-gradient(
    155deg,
    ${theme.colors.mainGradientFrom} 15%,
    ${theme.colors.mainGradientTo} 100%
  );
`

export const noMargin = css`
  margin: 0;
`
