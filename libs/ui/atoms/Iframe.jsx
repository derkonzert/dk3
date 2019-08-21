import React, { useState } from "react"
import styled from "@emotion/styled"
import { Button } from "../form/Button"
import { Description } from "./Typography"

export function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i)
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    return match[2]
  } else {
    return null
  }
}

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
            <Button ph="m" pv="m" mb="s" onClick={() => setShowEmbeded(true)}>
              Click, to load content from {getHostName(src)}
            </Button>

            <Description>{src}</Description>
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
  box-shadow: inset 0 0 1px ${({ theme }) => theme.colors.description};
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
