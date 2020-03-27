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

export const FancyFilling = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.boxBackground,
}))

export const EventLegend = () => (
  <Wrapper mb="xxl" data-legend>
    <Description>
      <Square>
        <Box mv="s">&nbsp;</Box>
      </Square>
      Some users saved the event
    </Description>
    <Description>
      <Square>
        <FancyBox mv="s">
          <FancyFilling>&nbsp;</FancyFilling>
        </FancyBox>
      </Square>
      Many users saved the event
    </Description>
    <Description>
      <Square>
        <SuperFancyBox mv="s">&nbsp;</SuperFancyBox>
      </Square>
      Almost every user saved the event
    </Description>
  </Wrapper>
)
