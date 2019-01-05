import React from "react"
import { mount } from "enzyme"

import { Box, FancyBox, SuperFancyBox } from "./Boxes"

describe("Boxes", () => {
  describe("Box", () => {
    it("mounts without throwing", () => {
      expect(() => mount(<Box />)).not.toThrow()
    })
  })
  describe("FancyBox", () => {
    it("mounts without throwing", () => {
      expect(() => mount(<FancyBox />)).not.toThrow()
    })
  })
  describe("SuperFancyBox", () => {
    it("mounts without throwing", () => {
      expect(() => mount(<SuperFancyBox />)).not.toThrow()
    })
  })
})
