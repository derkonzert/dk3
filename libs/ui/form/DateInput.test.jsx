import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { DateInput } from "./DateInput"
import { InputError, InputLabel } from "./TextInput"

expect.extend(matchers)

describe("DateInput", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<DateInput value={new Date()} />)).not.toThrow()
  })

  it("renders day, month and year in separate html inputs", () => {
    const value = new Date()
    const dateInput = mount(<DateInput value={value} />)

    expect(dateInput.find('input[name="day"]').props().value).toEqual(
      value.getDate()
    )

    expect(dateInput.find('input[name="month"]').props().value).toEqual(
      value.getMonth() + 1
    )

    expect(dateInput.find('input[name="year"]').props().value).toEqual(
      value.getFullYear()
    )
  })

  it("renders a label", () => {
    const value = new Date(2018, 3, 3)
    const label = "Insert Date!"
    const id = "my-date"

    const dateInput = mount(<DateInput value={value} label={label} id={id} />)

    expect(dateInput.find(InputLabel).text()).toBe(label)
    expect(dateInput.find(InputLabel).prop("htmlFor")).toBe(id)

    dateInput.setProps({ label: "" })

    expect(dateInput.find(InputLabel).exists()).toBe(false)
  })

  it("renders error messages", () => {
    const value = new Date(2018, 3, 3)
    const errorMessage = "Aint no date!"

    const dateInput = mount(<DateInput value={value} error={errorMessage} />)

    expect(dateInput.find(InputError).text()).toBe(errorMessage)

    dateInput.setProps({ error: "" })

    expect(dateInput.find(InputError).exists()).toBe(false)
  })

  it("passes a new date onChange", () => {
    const value = new Date(2018, 3, 3)
    const onChange = jest.fn()

    const dateInput = mount(<DateInput value={value} onChange={onChange} />)

    dateInput
      .find('input[name="day"]')
      .props()
      .onChange({ target: { value: 22 } })
    dateInput.update()

    expect(onChange.mock.calls[0][0].getDate()).toBe(22)

    dateInput
      .find('input[name="month"]')
      .props()
      .onChange({ target: { value: 5 } })
    dateInput.update()

    expect(onChange.mock.calls[1][0].getMonth()).toBe(4)

    dateInput
      .find('input[name="year"]')
      .props()
      .onChange({ target: { value: 2017 } })
    dateInput.update()

    expect(onChange.mock.calls[2][0].getFullYear()).toBe(2017)
  })

  it("passes validity as second argument to onChange handler", () => {
    const value = new Date(2018, 3, 3)
    const onChange = jest.fn()

    const dateInput = mount(<DateInput value={value} onChange={onChange} />)

    dateInput
      .find('input[name="day"]')
      .props()
      .onChange({ target: { value: 22 } })
    dateInput.update()

    expect(onChange.mock.calls[0][1]).toBe(true)

    dateInput
      .find('input[name="month"]')
      .props()
      .onChange({ target: { value: "" } })
    dateInput.update()

    expect(onChange.mock.calls[1][1]).toBe(false)
  })
})
