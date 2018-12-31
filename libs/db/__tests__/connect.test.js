const mongoose = require("mongoose")

const { logger } = require("@dk3/logger")
jest.mock("@dk3/logger")

const { connect } = require("../lib/connect")

describe("connect", () => {
  let origConnect
  let expectedDb
  let fakeConnection

  beforeEach(() => {
    origConnect = mongoose.connect
    mongoose.connect = jest.fn()

    expectedDb = { on: jest.fn() }
    fakeConnection = { connection: expectedDb }

    mongoose.connect.mockReturnValue(fakeConnection)
  })

  afterEach(() => {
    mongoose.connect = origConnect
  })

  it("creates a mongoose connection", async () => {
    const db = await connect()

    expect(db).toEqual(expectedDb)
  })

  it("adds 'error' event handler to connection", async () => {
    await connect()

    expect(expectedDb.on).toHaveBeenNthCalledWith(
      1,
      "error",
      expect.any(Function)
    )
  })

  it("adds 'open' event handler to connection", async () => {
    await connect()

    expect(expectedDb.on).toHaveBeenNthCalledWith(
      2,
      "open",
      expect.any(Function)
    )
  })

  describe("event handlers", () => {
    let fakeError

    beforeEach(() => {
      fakeError = new Error("oh nooo")

      expectedDb.on.mockImplementation((eventName, handler) => {
        if (eventName === "error") {
          handler(fakeError)
        } else if (eventName === "open") {
          handler()
        }
      })
    })

    it("error handler logs error message", async () => {
      await connect()

      expect(logger).toHaveBeenNthCalledWith(
        1,
        expect.any(String),
        fakeError.message
      )
    })

    it("error handler logs something", async () => {
      await connect()

      expect(logger).toHaveBeenNthCalledWith(2, expect.any(String))
    })
  })
})
