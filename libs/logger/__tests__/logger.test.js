/* eslint-disable no-console */
const logger = require("..")

describe("logger", () => {
  let origLog, log

  beforeEach(() => {
    /* monkey-patch console */
    log = jest.fn()
    origLog = console.log
    console.log = log
  })

  afterEach(() => {
    console.log = origLog
  })

  it("logs to console", () => {
    logger("my", "log", "call")

    expect(console.log).toHaveBeenCalledWith("my", "log", "call")
  })
})
