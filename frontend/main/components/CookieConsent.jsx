import React from "react"
import styled from "@emotion/styled"
import { Flex } from "@dk3/ui/atoms/Flex"
import { FancyButton } from "@dk3/ui/form/Button"
import { Box } from "@dk3/ui/atoms/Boxes"

const Position = styled.div`
  position: fixed;
  bottom: 0.5rem;
  left: 1rem;
  right: 1rem;
  z-index: 20;
`

export const CookieConsent = ({ children, onClick }) => (
  <Position>
    <Box pa={3}>
      <Flex grow={1}>
        <Flex grow={1}>{children}</Flex>
        <Flex grow={0}>
          <FancyButton onClick={onClick} ph={5}>
            Ok
          </FancyButton>
        </Flex>
      </Flex>
    </Box>
  </Position>
)
