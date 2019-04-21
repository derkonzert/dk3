import React from "react"

import { Spacer } from "@dk3/ui/atoms/Spacer"
import { Box, FancyBox, SuperFancyBox } from "@dk3/ui/atoms/Boxes"
import styled from "@emotion/styled"
import { Description } from "@dk3/ui/atoms/Typography"

export const Wrapper = styled(Spacer)`
  margin-left: auto;
  margin-right: auto;
`

export const Square = styled.span`
  display: inline-block;
  width: 2.5rem;
  margin-right: 1rem;
`

export const EventLegend = () => (
  <Wrapper mb={6} data-legend>
    <Description>
      <Square>
        <Box mv={2}>&nbsp;</Box>
      </Square>
      Some users saved the event
    </Description>
    <Description>
      <Square>
        <FancyBox mv={2}>&nbsp;</FancyBox>
      </Square>
      Many users saved the event
    </Description>
    <Description>
      <Square>
        <SuperFancyBox mv={2}>&nbsp;</SuperFancyBox>
      </Square>
      Almost every user saved the event
    </Description>
  </Wrapper>
)
