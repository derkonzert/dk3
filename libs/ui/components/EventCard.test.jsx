import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { Box, FancyBox, SuperFancyBox } from "../atoms/Boxes"
import { EventCard } from "./EventCard"

expect.extend(matchers)

describe("EventCard", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<EventCard />)).not.toThrow()
  })

  it("handles bookmark clicks", () => {
    const onBookmarkClick = jest.fn()
    const elem = mount(<EventCard onBookmarkClick={onBookmarkClick} />)

    elem.find("button").simulate("click")

    expect(onBookmarkClick).toHaveBeenCalledTimes(1)
  })

  it("sets bookmark active", () => {
    const elem = mount(<EventCard bookmarked />)

    expect(elem.find("button")).toHaveStyleRule("opacity", "1")
  })

  it("uses boxes depending on fancyLevel", () => {
    expect(
      mount(<EventCard fancyLevel={0} />)
        .find(Box)
        .exists()
    ).toBe(true)
    expect(
      mount(<EventCard fancyLevel={1} />)
        .find(FancyBox)
        .exists()
    ).toBe(true)
    expect(
      mount(<EventCard fancyLevel={2} />)
        .find(SuperFancyBox)
        .exists()
    ).toBe(true)
  })
})
