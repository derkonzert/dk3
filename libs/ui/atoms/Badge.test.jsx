import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { Badge, RedBadge, GreenBadge } from "./Badge"

expect.extend(matchers)

describe("Badge", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<Badge />)).not.toThrow()
  })
})

describe("GreenBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<GreenBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mount(<GreenBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})

describe("RedBadge", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<RedBadge />)).not.toThrow()
  })

  it("has inverted state", () => {
    const badge = mount(<RedBadge inverted />)

    expect(badge).toHaveStyleRule("color", "white")
  })
})
