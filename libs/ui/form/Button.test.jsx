import React from "react"
import { matchers } from "jest-emotion"
import { mountWithTheme } from "../utils/testHelpers"

import {
  Button,
  FancyButton,
  VeryFancyButton,
  buttonBlockModifier,
  buttonBlockStyle,
} from "./Button"

expect.extend(matchers)

describe("Buttons", () => {
  describe("normal Button", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<Button />)).not.toThrow()
    })
  })

  describe("FancyButton", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<FancyButton />)).not.toThrow()
    })
  })

  describe("VeryFancyButton", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<VeryFancyButton />)).not.toThrow()
    })
  })

  describe("buttonBlockModifier", () => {
    it("returns false when block is falsy", () => {
      expect(buttonBlockModifier({})).toBe(false)
    })

    it("returns block styles when block is truthy", () => {
      expect(buttonBlockModifier({ block: true })).toBe(buttonBlockStyle)
    })
  })
})
