import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

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
      expect(() => mount(<Button />)).not.toThrow()
    })
  })

  describe("FancyButton", () => {
    it("mounts without throwing", () => {
      expect(() => mount(<FancyButton />)).not.toThrow()
    })
  })

  describe("VeryFancyButton", () => {
    it("mounts without throwing", () => {
      expect(() => mount(<VeryFancyButton />)).not.toThrow()
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
