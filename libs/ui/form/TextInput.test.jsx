import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { TextInput, InputError, InputBorder, InputLabel } from "./TextInput"
import { validInputStyle, invalidInputStyle } from "./inputStyles"

expect.extend(matchers)

describe("TextInput", () => {
  it("mounts without throwing", () => {
    expect(() => mount(<TextInput />)).not.toThrow()
  })

  it("renders an error", () => {
    const element = mount(<TextInput error="My error" />)

    expect(element.find(InputError).text()).toBe("My error")

    element.setProps({ error: undefined })

    expect(element.find(InputError).exists()).toBe(false)
  })

  it("renders a label", () => {
    const element = mount(<TextInput label="My Label" />)

    expect(element.find(InputLabel).text()).toBe("My Label")

    element.setProps({ label: undefined })

    expect(element.find(InputLabel).exists()).toBe(false)
  })

  it("renders different backgrounds for valid, invalid or no validation", () => {
    const noValidationBg = mount(<TextInput />).find(InputBorder)
    const validBg = mount(<TextInput validate valid />).find(InputBorder)
    const invalidBg = mount(<TextInput validate valid={false} />).find(
      InputBorder
    )

    const stylesToArguments = styles =>
      styles.split(":").map(v => v.replace(/\s/g, "").replace(";", ""))

    expect(noValidationBg).toHaveStyleRule("background", "hsl(0,0%,80%)")
    expect(validBg).toHaveStyleRule(
      ...stylesToArguments(validInputStyle.styles)
    )
    expect(invalidBg).toHaveStyleRule(
      ...stylesToArguments(invalidInputStyle.styles)
    )
  })
})
