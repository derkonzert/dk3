import React from "react"
import { mount } from "enzyme"

import {
  MegaTitle,
  Title,
  SubTitle,
  Text,
  WrappingText,
  Link,
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

  describe("Text", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<Text />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<Text inverted />)).not.toThrow()
    })
  })

  describe("WrappingText", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<WrappingText />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<WrappingText inverted />)).not.toThrow()
    })
  })

  describe("Link", () => {
    it("mounts without Throwing", () => {
      expect(() => mount(<Link />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mount(<Link inverted />)).not.toThrow()
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
