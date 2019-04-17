import React from "react"
import { matchers } from "jest-emotion"

import { DateInput } from "./DateInput"
import { DateTimeInput } from "./DateTimeInput"
import { mountWithTheme } from "../utils/testHelpers"
import { TimeInput } from "./TimeInput"

expect.extend(matchers)

describe("DateTimeInput", () => {
  it("mounts without throwing", () => {
    expect(() =>
      mountWithTheme(<DateTimeInput value={new Date()} />)
    ).not.toThrow()
  })

  it("renders date in DateInput", () => {
    const value = new Date()
    const dateInput = mountWithTheme(<DateTimeInput value={value} />)

    expect(dateInput.find(DateInput).props().value).toEqual(value)
  })

  it("passes a new date as second argument to onChange", () => {
    const value = new Date(2018, 3, 3)
    const onChange = jest.fn()

    const dateTimeInput = mountWithTheme(
      <DateTimeInput value={value} onChange={onChange} />
    )

    dateTimeInput
      .find(DateInput)
      .props()
      .onChange({ target: { value: "2019-03-22" } }, new Date(2019, 3, 22))

    expect(onChange.mock.calls[0][1].getDate()).toBe(22)
    expect(onChange.mock.calls[0][1].getMonth()).toBe(3)
    expect(onChange.mock.calls[0][1].getFullYear()).toBe(2019)
    expect(onChange.mock.calls[0][1].getMinutes()).toBe(0)
    expect(onChange.mock.calls[0][1].getHours()).toBe(0)

    dateTimeInput
      .find(TimeInput)
      .props()
      .onChange({ target: { value: "11:12" } }, new Date(2018, 1, 1, 11, 12))

    dateTimeInput.update()

    expect(onChange.mock.calls[1][1].getMinutes()).toBe(12)
    expect(onChange.mock.calls[1][1].getHours()).toBe(11)

    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
