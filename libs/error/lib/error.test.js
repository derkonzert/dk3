"use strict"

const { HTTPStatusError, InvalidConfigurationError } = require("..")

describe("error", () => {
  describe("InvalidConfigurationError", () => {
    it("creates configuraiton error", () => {
      const err = new InvalidConfigurationError({
        title: "Uh oh",
      })

      expect(err.type).toBe("configuration")

      expect(err.title).toEqual(expect.stringContaining("Uh oh"))
    })
  })

  describe("HTTPStatusError", () => {
    it("creates status error", () => {
      const err = new HTTPStatusError({
        title: "Not found",
        statusCode: 404,
      })

      expect(err.type).toBe("server")

      expect(err.title).toEqual(expect.stringContaining("Not found"))
      expect(err.statusCode).toEqual(404)
    })
  })
})
