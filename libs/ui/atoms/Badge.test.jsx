import React from "react"
import { matchers } from "jest-emotion"

import { Badge, RedBadge, GreenBadge } from "./Badge"
import { mountWithTheme } from "../utils/testHelpers"

expect.extend(matchers)

describe("Badge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<Badge />)).not.toThrow()
  })
})

describe("GreenBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<GreenBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mountWithTheme(<GreenBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})

describe("RedBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<RedBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mountWithTheme(<RedBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})
