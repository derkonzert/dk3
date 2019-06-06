import React from "react"
import { matchers } from "jest-emotion"

import { Badge, DangerBadge, SuccessBadge } from "./Badge"
import { mountWithTheme } from "../utils/testHelpers"

expect.extend(matchers)

describe("Badge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<Badge />)).not.toThrow()
  })
})

describe("SuccessBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<SuccessBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mountWithTheme(<SuccessBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})

describe("DangerBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<DangerBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mountWithTheme(<DangerBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})
