import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { noMargin, gradientBackground } from "../common"

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

  @supports (-webkit-text-fill-color: transparent) {
    ${gradientBackground}
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:after {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0.3rem;
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
  font-family: "IBM Plex Serif", serif;

  font-size: 1.2rem;
  color: ${({ inverted }) => (inverted ? "#f9f9f9" : "#636161")};
  letter-spacing: 0;
  line-height: 2rem;
`
