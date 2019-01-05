import React from "react"
import { mount } from "enzyme"

import { CalendarDay, Day } from "./CalendarDay"

describe("CalendarDay", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<CalendarDay day={12} dayName="Fr" />)).not.toThrow()
  })

  it("concerts days < 9 to 0x", () => {
    expect(
      mount(<CalendarDay day={2} dayName="Fr" />)
        .find(Day)
        .text()
    ).toBe("02")
  })

  it("has inverted variant", () => {
    expect(() =>
      mount(<CalendarDay inverted day={12} dayName="Fr" />)
    ).not.toThrow()
  })
})
