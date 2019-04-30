import React from "react"
import { matchers } from "jest-emotion"

import { mountWithTheme } from "../utils/testHelpers"

import { EventCard, EventBox } from "./EventCard"

expect.extend(matchers)

describe("EventCard", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<EventCard />)).not.toThrow()
  })

  it("handles bookmark clicks", () => {
    const onBookmarkClick = jest.fn()
    const elem = mountWithTheme(<EventCard onBookmarkClick={onBookmarkClick} />)

    elem.find("button").simulate("click")

    expect(onBookmarkClick).toHaveBeenCalledTimes(1)
  })

  it("sets bookmark active", () => {
    const elem = mountWithTheme(<EventCard bookmarked />)

    expect(elem.find("button")).toHaveStyleRule("opacity", "1")
  })

  it("sets fancyLevel on BaseBox", () => {
    expect(
      mountWithTheme(<EventCard fancyLevel={0} />)
        .find(EventBox)
        .prop("fancyLevel")
    ).toBe(0)
    expect(
      mountWithTheme(<EventCard fancyLevel={1} />)
        .find(EventBox)
        .prop("fancyLevel")
    ).toBe(1)
    expect(
      mountWithTheme(<EventCard fancyLevel={2} />)
        .find(EventBox)
        .prop("fancyLevel")
    ).toBe(2)
  })
})
