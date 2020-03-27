import React from "react"

import { CalendarDay, Day } from "./CalendarDay"
import { mountWithTheme } from "../utils/testHelpers"

describe("CalendarDay", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithTheme(<CalendarDay day={12} dayName="Fr" />)
    ).not.toThrow()
  })

  it("concerts days < 9 to 0x", () => {
    expect(
      mountWithTheme(<CalendarDay day={2} dayName="Fr" />)
        .find(Day)
        .text()
    ).toBe("02")
  })

  it("has inverted variant", () => {
    expect(() =>
      mountWithTheme(<CalendarDay inverted day={12} dayName="Fr" />)
    ).not.toThrow()
  })
})
