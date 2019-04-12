import React from "react"
import { matchers } from "jest-emotion"

import { DateInput } from "./DateInput"
import { mountWithTheme } from "../utils/testHelpers"

expect.extend(matchers)

describe("DateInput", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<DateInput value={new Date()} />)).not.toThrow()
  })

  it("renders day, month and year in html date input", () => {
    const value = new Date()
    const dateInput = mountWithTheme(<DateInput value={value} />)

    expect(dateInput.find("input").props().type).toEqual("date")
  })

  it("passes a new date as second argument to onChange", () => {
    const value = new Date(2018, 3, 3)
    const onChange = jest.fn()

    const dateInput = mountWithTheme(
      <DateInput value={value} onChange={onChange} />
    )

    dateInput
      .find("input")
      .props()
      .onChange({ target: { value: "2019-03-22" } })
    dateInput.update()

    expect(onChange.mock.calls[0][1].getDate()).toBe(22)
    expect(onChange.mock.calls[0][1].getMonth()).toBe(2)
    expect(onChange.mock.calls[0][1].getFullYear()).toBe(2019)
  })

  it("passes null as second argument when date is invalid", () => {
    const value = new Date(2018, 3, 3)
    const onChange = jest.fn()

    const dateInput = mountWithTheme(
      <DateInput value={value} onChange={onChange} />
    )

    dateInput
      .find("input")
      .props()
      .onChange({ target: { value: "22" } })
    dateInput.update()

    expect(onChange.mock.calls[0][1]).toBe(null)
  })
})
