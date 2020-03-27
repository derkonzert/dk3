import React from "react"

import { mountWithTheme } from "../utils/testHelpers"

import {
  MegaTitle,
  Title,
  SubTitle,
  Text,
  WrappingText,
  Link,
  ListTitle,
  Description,
  Small,
} from "./Typography"

describe("Typography", () => {
  describe("MegaTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<MegaTitle />)).not.toThrow()
    })
  })

  describe("Title", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<Title />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<Title inverted />)).not.toThrow()
    })
  })

  describe("SubTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<SubTitle />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<SubTitle inverted />)).not.toThrow()
    })
  })

  describe("ListTitle", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<ListTitle />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<ListTitle inverted />)).not.toThrow()
    })
  })

  describe("Text", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<Text />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<Text inverted />)).not.toThrow()
    })
  })

  describe("WrappingText", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<WrappingText />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<WrappingText inverted />)).not.toThrow()
    })
  })

  describe("Link", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<Link />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<Link inverted />)).not.toThrow()
    })
  })

  describe("Description", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<Description />)).not.toThrow()
    })

    it("has inverted", () => {
      expect(() => mountWithTheme(<Description inverted />)).not.toThrow()
    })
  })

  describe("Small", () => {
    it("mounts without Throwing", () => {
      expect(() => mountWithTheme(<Small />)).not.toThrow()
    })
  })
})
