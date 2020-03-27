import React from "react"
import { CenteredContent } from "@dk3/ui/layouts/ListAndDetail"
import { HeaderMenu } from "./HeaderMenu/HeaderMenu"
import { Flex } from "@dk3/ui/atoms/Flex"
import { SideNavigation } from "./SideNavigation"
import { Spacer } from "@dk3/ui/atoms/Spacer"
import styled from "@emotion/styled"

const Left = styled.div`
  width: 20rem;
`

const Right = styled(Spacer)`
  width: 100%;
  background: ${({ theme }) => theme.colors.detailBackground};
`

export const PageWrapper = ({ children }) => (
  <CenteredContent>
    <HeaderMenu />

    <Flex justifyContent="space-between">
      <Left>
        <SideNavigation />
      </Left>
      <Right ml="l" pa="l">
        <Spacer>{children}</Spacer>
      </Right>
    </Flex>
  </CenteredContent>
)
