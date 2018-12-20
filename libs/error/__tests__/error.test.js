"use strict"

const { HTTPStatusError, InvalidConfigurationError } = require("..")

describe("error", () => {
  function genericTestsFor(CustomError) {
    const message = "Custom error message"

    it("implements instanceof correctly", () => {
      const err = new CustomError()

      expect(err instanceof CustomError).toBeTruthy()
    })

    it("has a stacktrace", () => {
      const err = new CustomError()

      expect(err.stack).toBeTruthy()
    })

    it("supports basic message", () => {
      const err = new CustomError(message)

      expect(err.message).toEqual(message)
    })
  }

  describe("InvalidConfigurationError", () => {
    genericTestsFor(InvalidConfigurationError)
  })

  describe("HTTPStatusError", () => {
    genericTestsFor(HTTPStatusError)

    it("stores status and creates getter", () => {
      const err = new HTTPStatusError("Uh oh", 401)

      expect(err.getStatus()).toEqual(401)
    })
  })
})
