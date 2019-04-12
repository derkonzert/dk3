import React from "react"
import { matchers } from "jest-emotion"

import {
  TextInput,
  InputError,
  InputBorder,
  InputLabel,
  InputDescription,
} from "./TextInput"
import { validInputStyle, invalidInputStyle } from "./inputStyles"
import { mountWithTheme } from "../utils/testHelpers"
import { themes } from "../theme"

expect.extend(matchers)

describe("TextInput", () => {
  it("mounts without throwing", () => {
    expect(() => mountWithTheme(<TextInput />)).not.toThrow()
  })

  it("by default renders no error", () => {
    const element = mountWithTheme(<TextInput />)

    expect(element.find(InputError).exists()).toBe(false)
  })

  it("renders an error", () => {
    const element = mountWithTheme(<TextInput error="My error" />)

    expect(element.find(InputError).text()).toBe("My error")
  })

  it("by default renders no label", () => {
    const element = mountWithTheme(<TextInput />)

    expect(element.find(InputLabel).exists()).toBe(false)
  })

  it("renders a label", () => {
    const element = mountWithTheme(<TextInput label="My Label" />)

    expect(element.find(InputLabel).text()).toBe("My Label")
  })

  it("by default renders no description", () => {
    const element = mountWithTheme(<TextInput />)

    expect(element.find(InputDescription).exists()).toBe(false)
  })

  it("renders a description", () => {
    const element = mountWithTheme(<TextInput description="My Description" />)

    expect(element.find(InputDescription).text()).toBe("My Description")
  })

  it("renders different backgrounds for valid, invalid or no validation", () => {
    const noValidationBg = mountWithTheme(<TextInput />).find(InputBorder)
    const validBg = mountWithTheme(<TextInput validate valid />).find(
      InputBorder
    )
    const invalidBg = mountWithTheme(<TextInput validate valid={false} />).find(
      InputBorder
    )

    const stylesToArguments = styles =>
      styles.split(":").map(v => v.replace(/\s/g, "").replace(";", ""))

    expect(noValidationBg).toHaveStyleRule("background", "hsl(0,0%,80%)")
    expect(validBg).toHaveStyleRule(
      ...stylesToArguments(validInputStyle({ theme: themes.light }).styles)
    )

    expect(invalidBg).toHaveStyleRule(
      ...stylesToArguments(invalidInputStyle({ theme: themes.light }).styles)
    )
  })
})
