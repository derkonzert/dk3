import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { noMargin, gradientBackground } from "../common"
import { withSpacing } from "../utils/withSpacing"

const titleStyle = css`
  ${noMargin};
  font-family: "IBM Plex Serif", serif;
  font-weight: bold;
  color: black;
  letter-spacing: 0;
`

export const MegaTitle = styled.h1`
  ${titleStyle};
  position: relative;
  display: inline-block;
  font-size: 3.2rem;
  line-height: 1.4;
  margin: 1rem 0;

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.2rem;
    height: 0.4rem;
    border-radius: 0.2rem;

    ${gradientBackground};
  }
`

export const Title = styled.h2`
  ${titleStyle};
  font-size: 2.4rem;
  color: ${({ inverted }) => (inverted ? "white" : "black")};
`

export const SubTitle = styled.h3`
  ${noMargin};
  font-family: "IBM Plex Sans", sans-serif;
  font-weight: 600;
  font-size: 1.8rem;
  color: ${({ inverted }) => (inverted ? "white" : "black")};
  letter-spacing: 0;
  line-height: 2.2rem;
`

export const ListTitle = styled.h4`
  margin: 2.5rem 0;
  font-family: "IBM Plex Serif", serif;

  font-size: 2rem;
  font-weight: normal;
  color: ${({ inverted }) => (inverted ? "white" : "black")};
  letter-spacing: 0;
  line-height: 2rem;
`

export const Description = styled.div`
  ${noMargin};
  font-family: "IBM Plex Sans", serif;

  font-size: 1.2rem;
  color: ${({ inverted }) => (inverted ? "#f9f9f9" : "#636161")};
  letter-spacing: 0;
  line-height: 2rem;
`

export const Text = styled.p`
  ${noMargin};
  font-family: "IBM Plex Sans", serif;

  font-size: 1.2rem;
  color: ${({ inverted }) => (inverted ? "#f9f9f9" : "#3F3F3F")};
  letter-spacing: 0;
  line-height: 1.8rem;
  max-width: 38em;
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

  color: ${({ inverted }) => (inverted ? "#fff" : "#000")};
  text-decoration: underline;

  &:hover {
    color: ${({ inverted }) => (inverted ? "#eee" : "#333")};

    ${gradientBackground};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    box-decoration-break: clone;
  }
`)

export const ButtonLink = Link.withComponent("button")
