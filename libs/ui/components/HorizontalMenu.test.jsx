import React from "react"
import { matchers } from "jest-emotion"

import { mountWithTheme } from "../utils/testHelpers"

import { HorizontalMenu, HorizontalMenuItem } from "./HorizontalMenu"

expect.extend(matchers)

describe("HorizontalMenu", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithTheme(
        <HorizontalMenu>
          <HorizontalMenuItem>Hey</HorizontalMenuItem>
          <HorizontalMenuItem>Ho</HorizontalMenuItem>
        </HorizontalMenu>
      )
    ).not.toThrow()
  })
})
