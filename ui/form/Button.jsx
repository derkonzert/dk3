import styled from "@emotion/styled"
import { css, keyframes } from "@emotion/core"
import { withSpacing } from "../utils/withSpacing"
import { gradientBackground } from "../common"

const buttonBaseStyle = css`
  appearance: none;
  border: 0 none;
  border-radius: 2px;
  padding: 0.5rem 0.8rem;

  font-family: "IBM Plex Mono", monospace;
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.6rem;
  letter-spacing: -0.4px;
  text-align: center;
  color: inherit;

  flex: 1 1 auto;

  cursor: pointer;

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`

export const buttonBlockStyle = css`
  display: block;
  width: 100%;
`

export const buttonBlockModifier = ({ block }) => !!block && buttonBlockStyle

const Btn = styled.button`
  ${buttonBaseStyle};
  ${buttonBlockModifier};

  background-color: transparent;
  color: ${({ theme }) => theme.colors.buttonColor};
  box-shadow: inset 0 0 0 0.1rem ${({ theme }) => theme.colors.buttonBorder};

  &:hover {
    box-shadow: inset 0 0 0 0.1rem
      ${({ theme }) => theme.colors.buttonBorderHover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.buttonBackgroundActive};
  }
`

export const Button = withSpacing()(Btn)
export const ButtonLink = withSpacing()(Btn.withComponent("a"))

const VeryFancy = styled.button`
  ${buttonBaseStyle};
  ${gradientBackground};
  ${buttonBlockModifier};

  text-decoration: none;
  color: ${({ theme }) => theme.colors.veryFancyButtonColor};

  &:hover {
    opacity: 0.85;
  }

  &:active {
    opacity: 1;
    box-shadow: inset 0 -20rem 0 0 rgba(0, 0, 0, 0.15);
  }
`

export const VeryFancyButton = withSpacing()(VeryFancy)

export const VeryFancyLink = withSpacing()(VeryFancy.withComponent("a"))

const fancyHoverKeyFrame = keyframes`
  from {
    background-position-x: 0%;
  }
  to {
    background-position-x: 50%;
  }
`

export const FancyButton = withSpacing()(styled.button`
  ${buttonBaseStyle};
  position: relative;

  background: ${({ theme }) => theme.colors.fancyButtonBackground};

  ${buttonBlockModifier};

  color: ${({ theme }) => theme.colors.fancyButtonColor};
  z-index: 1;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 2px;
    background: linear-gradient(
      90deg,
      rgb(255, 87, 87),
      rgb(106, 50, 204),
      rgb(255, 87, 87),
      rgb(106, 50, 204),
      rgb(255, 87, 87),
      rgb(106, 50, 204)
    );
    background-size: 500% 200%;
    z-index: -1;

    transition: 300ms background-position;
  }

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    z-index: -1;

    border-radius: 1px;
    margin: 2px;
  }

  &:hover:before {
    background-position-x: 25%;
    text-decoration: underline;
    animation: 0.5s ${fancyHoverKeyFrame} ease-in-out infinite;
  }

  &:active:after {
    box-shadow: inset 0 -20rem 0 0 rgba(0, 0, 0, 0.1);
  }
`)
