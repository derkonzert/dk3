"use strict"

const defaults = require("../lib/defaults")
jest.mock("../lib/defaults")

defaults.FAKE_DEFAULT = "Ahoi Boi!"
defaults.FAKE_DEFAULT_OVERWRITE = "Ahoi Boi 2!"

describe("config", () => {
  /* set vars before requiring env */
  process.env.MY_FIRST_TEST_VAR = "MY_FIRST_TEST_VALUE"
  process.env.FAKE_DEFAULT_OVERWRITE = "OVERRULLED, BOI!"

  const config = require("..")

  process.env.MY_SECOND_TEST_VAR = "MY_SECOND_TEST_VALUE"

  it("fails for not defined configuration", () => {
    expect(() => config.get("NOT_DEFINED_VAR")).toThrow()
  })

  it("fails not when throwOnError is false", () => {
    expect(() => config.get("NOT_DEFINED_VAR", false)).not.toThrow()
  })

  it("retrieves values set before require", () => {
    expect(config.get("MY_FIRST_TEST_VAR")).toBe(process.env.MY_FIRST_TEST_VAR)
  })

  it("does not recognize values set after require", () => {
    expect(() => config.get("MY_SECOND_TEST_VAR")).toThrowError()
  })

  it("does not recognize values changed after first require", () => {
    process.env.MY_FIRST_TEST_VAR = "Modified?"

    expect(config.get("MY_FIRST_TEST_VAR")).toBe("MY_FIRST_TEST_VALUE")
  })

  it("does recognize changes via override method", () => {
    config.override("MY_FIRST_TEST_VAR", "some override")

    expect(config.get("MY_FIRST_TEST_VAR")).toEqual("some override")
  })

  it("includes defaults", () => {
    expect(config.get("FAKE_DEFAULT")).toBe(defaults.FAKE_DEFAULT)
  })

  it("allows defaults to be overwritten", () => {
    expect(config.get("FAKE_DEFAULT_OVERWRITE")).toBe(
      process.env.FAKE_DEFAULT_OVERWRITE
    )
  })
})
