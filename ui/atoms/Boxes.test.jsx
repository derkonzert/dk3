import React from "react"

import { Box, FancyBox, SuperFancyBox } from "./Boxes"
import { mountWithTheme } from "../utils/testHelpers"

describe("Boxes", () => {
  describe("Box", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<Box />)).not.toThrow()
    })
  })
  describe("FancyBox", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<FancyBox />)).not.toThrow()
    })
  })
  describe("SuperFancyBox", () => {
    it("mounts without throwing", () => {
      expect(() => mountWithTheme(<SuperFancyBox />)).not.toThrow()
    })
  })
})
