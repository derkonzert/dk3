import React from "react"
import { matchers } from "jest-emotion"
import { mount } from "enzyme"

import { Button, FancyButton, VeryFancyButton } from "./Button"

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
})
