import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { HorizontalMenu, HorizontalMenuItem } from "./HorizontalMenu"

expect.extend(matchers)

describe("HorizontalMenu", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mount(
        <HorizontalMenu>
          <HorizontalMenuItem>Hey</HorizontalMenuItem>
          <HorizontalMenuItem>Ho</HorizontalMenuItem>
        </HorizontalMenu>
      )
    ).not.toThrow()
  })
})
