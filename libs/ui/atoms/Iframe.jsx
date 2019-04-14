import React, { useState } from "react"
import styled from "@emotion/styled"
import { Button } from "../form/Button"
import { Description, SubTitle } from "./Typography"

export const Iframe = ({ src, id }) => {
  const [showEmbeded, setShowEmbeded] = useState(false)

  return (
    <Wrapper>
      <Scaler>
        {showEmbeded ? (
          <Frame
            id={`iframe-${id}`}
            src={src}
            type="text/html"
            frameBorder="0"
          />
        ) : (
          <ShowEmbedWarning>
            <SubTitle mb={3}>Show content from different website?</SubTitle>

            <Button ph={3} pv={3} mb={2} onClick={() => setShowEmbeded(true)}>
              Load content
            </Button>

            <Description>{src.substr(0, 50)}…</Description>
          </ShowEmbedWarning>
        )}
      </Scaler>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: block;
  max-width: 680px;
  min-width: 250px;
  width: 100%;
  margin: 1rem 0;
  background: ${({ theme }) => theme.colors.siteBackground};
`

const Scaler = styled.div`
  display: block;
  position: relative;
  width: 100%;
  padding-top: 60%;
`

const Frame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.siteBackground};
`

const ShowEmbedWarning = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`
