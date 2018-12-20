"use strict"

const { InvalidConfigurationError } = require("..")

describe("InvalidConfigurationError", () => {
  it("implements instanceof correctly", () => {
    const err = new InvalidConfigurationError()

    expect(err instanceof InvalidConfigurationError).toBeTruthy()
  })

  it("has a stacktrace", () => {
    const err = new InvalidConfigurationError()

    expect(err.stack).toBeTruthy()
  })
})
