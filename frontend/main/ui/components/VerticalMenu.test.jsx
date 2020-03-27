import React from "react"
import { matchers } from "jest-emotion"

import { mountWithTheme } from "../utils/testHelpers"

import { VerticalMenu, VerticalMenuItem } from "./VerticalMenu"

expect.extend(matchers)

describe("VerticalMenu", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithTheme(
        <VerticalMenu>
          <VerticalMenuItem>Hey</VerticalMenuItem>
          <VerticalMenuItem>Ho</VerticalMenuItem>
        </VerticalMenu>
      )
    ).not.toThrow()
  })
})
