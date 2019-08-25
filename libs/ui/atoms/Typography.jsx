import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { noMargin, gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

const logoStyle = ({ theme }) => css`
  position: relative;
  display: inline-block;
  font-family: "IBM Plex Serif", serif;
  font-weight: bold;
  color: ${theme.colors.title};
  letter-spacing: 0;
  margin: 1rem 0;

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;

    bottom: -0.18em;
    height: 0.12em;
    border-radius: 0.12em;

    ${gradientBackground({ theme })};
  }
`

export const LogoTitle = withSpacing()(styled.h1`
  font-size: 3.75rem;
  line-height: 1;
  ${logoStyle}
`)

export const MegaTitle = withSpacing()(styled.h1`
  font-size: 3.2rem;
  line-height: 1.2;
  ${logoStyle}
`)

export const Title = withSpacing()(styled.h2`
  ${noMargin}
  font-size: 2.4rem;
  font-family: "IBM Plex Serif", serif;
  font-weight: bold;
  color: black;
  letter-spacing: 0;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.titleInverted : theme.colors.title};
`)

export const SubTitle = withSpacing()(styled.h3`
  ${noMargin};
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 600;
  font-size: 1.6rem;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.titleInverted : theme.colors.title};
  letter-spacing: 0;
  line-height: 2.2rem;
`)

export const ListTitle = withSpacing()(styled.h4`
  margin: 2.5rem 0;
  font-family: "IBM Plex Serif", serif;

  font-size: 2rem;
  font-weight: normal;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.titleInverted : theme.colors.title};
  letter-spacing: 0;
  line-height: 2rem;
`)

export const ListTitleAppendix = styled.span`
  color: ${({ theme }) => theme.colors.titleAppendix};
`

export const Hr = withSpacing({ mv: "m" })(styled.hr`
  border: 0 none;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.hr};
`)

export const Slogan = styled.h2`
  ${noMargin};
  font-family: "IBM Plex Serif", serif;

  font-size: 1.4rem;
  font-weight: normal;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.descriptionInverted : theme.colors.description};
  letter-spacing: 0;
  line-height: 2rem;
`

export const Description = styled.div`
  ${noMargin};
  font-family: "IBM Plex Sans", sans-serif;

  font-size: 1.2rem;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.descriptionInverted : theme.colors.description};
  letter-spacing: 0;
  line-height: 1.3;
`

export const Text = withSpacing()(styled.p`
  ${noMargin};
  font-family: "IBM Plex Sans", sans-serif;

  font-size: 1.2rem;
  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.textInverted : theme.colors.text};
  letter-spacing: 0;
  line-height: 1.8rem;
  max-width: 38em;
`)

export const Small = styled.small`
  font-size: 0.8em;
`

export const Strong = styled.strong`
  font-weight: bold;
`

export const WrappingText = styled(Text)`
  white-space: pre-wrap;
`

export const Link = withSpacing()(styled.a`
  display: inline-block;

  font: inherit;
  cursor: pointer;
  appearance: none;
  border: none;
  background: none;

  color: ${({ inverted, theme }) =>
    inverted ? theme.colors.linkInverted : theme.colors.link};
  text-decoration: underline;

  &:hover {
    color: ${({ inverted, theme }) =>
      inverted ? theme.colors.linkHoverInverted : theme.colors.linkHover};

    ${gradientBackground};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    box-decoration-break: clone;
  }
`)
