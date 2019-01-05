import React from "react"
import { mount } from "enzyme"

import {
  MegaTitle,
  Title,
  SubTitle,
  ListTitle,
  Description,
} from "./Typography"

describe("Typography", () => {
  describe("MegaTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<MegaTitle />)).not.toThrow()
    })
  })

  describe("Title", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<Title />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<Title inverted />)).not.toThrow()
    })
  })

  describe("SubTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<SubTitle />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<SubTitle inverted />)).not.toThrow()
    })
  })

  describe("ListTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<ListTitle />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<ListTitle inverted />)).not.toThrow()
    })
  })

  describe("Description", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<Description />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<Description inverted />)).not.toThrow()
    })
  })
})
