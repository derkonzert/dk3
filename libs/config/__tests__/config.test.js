"use strict"

const { InvalidConfigurationError } = require("@dk3/error")

describe("config", () => {
  /* set vars before requiring env */
  process.env.MY_FIRST_TEST_VAR = "MY_FIRST_TEST_VALUE"

  const config = require("..")

  process.env.MY_SECOND_TEST_VAR = "MY_SECOND_TEST_VALUE"

  it("fails for not defined configuration", () => {
    expect(() => config.get("NOT_DEFINED_VAR")).toThrowError(
      InvalidConfigurationError
    )
  })

  it("fails not when throwOnError is false", () => {
    expect(() => config.get("NOT_DEFINED_VAR", false)).not.toThrow()
  })

  it("retrieves values set before require", () => {
    expect(config.get("MY_FIRST_TEST_VAR")).toBe(process.env.MY_FIRST_TEST_VAR)
  })

  it("does not recognize values set after require", () => {
    expect(() => config.get("MY_SECOND_TEST_VAR")).toThrowError(
      InvalidConfigurationError
    )
  })

  it("does not recognize values changed after first require", () => {
    process.env.MY_FIRST_TEST_VAR = "Modified?"

    expect(config.get("MY_FIRST_TEST_VAR")).toBe("MY_FIRST_TEST_VALUE")
  })
})
