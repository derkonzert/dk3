/** @jsx jsx */
import { jsx, css } from "@emotion/core"
import { gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

const box = css`
  padding: 3px;
  border-radius: 4px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
`

const boxInner = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: stretch;

  padding: 0;
`

const fancyBox = css`
  ${box};
  ${gradientBackground};
`

const fancyBoxInner = css`
  ${boxInner};
  background: white;
`

const superFancyBox = css`
  ${box};
  ${gradientBackground};
  color: white;
`

export const Box = withSpacing({ mv: 3 })(({ children, ...props }) => (
  <div css={box} {...props}>
    <div css={boxInner}>{children}</div>
  </div>
))

export const FancyBox = withSpacing({ mv: 3 })(({ children, ...props }) => (
  <div css={fancyBox} {...props}>
    <div css={fancyBoxInner}>{children}</div>
  </div>
))

export const SuperFancyBox = withSpacing({ mv: 3 })(
  ({ children, ...props }) => (
    <div css={superFancyBox} {...props}>
      <div css={boxInner}>{children}</div>
    </div>
  )
)
