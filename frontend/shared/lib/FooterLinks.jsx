import React from "react"
import { Flex } from "@dk3/ui/atoms/Flex"
import { FooterLink, FooterCheckbox } from "@dk3/ui/components/Footer"

export const FooterLinks = ({ themeName, onThemeChange }) => (
  <Flex
    mt="xl"
    mh="auto"
    basis="100%"
    flexDirection="row"
    alignItems="center"
    justifyContent="center"
    style={{ textAlign: "center", maxWidth: "68.8rem" }}
  >
    <Flex basis="auto" grow="0.2" justifyContent="center">
      <FooterLink href="/pages/about">About</FooterLink>
    </Flex>
    <Flex basis="auto" grow="0.2" justifyContent="center">
      <FooterLink href="/archive">Archive</FooterLink>
    </Flex>
    <Flex basis="auto" grow="0.2" justifyContent="center">
      <FooterLink href="/pages/imprint">Imprint</FooterLink>
    </Flex>
    <Flex basis="auto" grow="0.2" justifyContent="center">
      <FooterLink href="/pages/privacy">Privacy</FooterLink>
    </Flex>
    {!!(themeName && onThemeChange) && (
      <Flex basis="auto" grow="0.2" justifyContent="center">
        <FooterCheckbox
          mv="none"
          label="Dark Mode"
          checked={themeName === "dark"}
          onChange={onThemeChange}
        />
      </Flex>
    )}
  </Flex>
)
