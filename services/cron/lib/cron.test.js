const db = require("@dk3/db")
jest.mock("@dk3/db")

const apiUtils = require("@dk3/api-utils")
jest.mock("@dk3/api-utils")
apiUtils.sendJson = jest.fn()

const cronService = require("..")

describe("cron", () => {
  let req, res, connection, results, errors

  beforeEach(() => {
    req = {}
    res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    }
    apiUtils.sendJson.mockReset()
    connection = { close: jest.fn() }

    db.cron.setup = jest.fn()
    results = []
    errors = []
    db.cron.runAll = jest.fn().mockReturnValue([results, errors])

    db.connect.mockReset()
    db.connect.mockResolvedValue(connection)
  })

  it("runs setup script for cron once", async () => {
    await cronService(req, res)
    await cronService(req, res)

    expect(db.cron.setup).toHaveBeenCalledTimes(1)
  })

  it("runs runAll script for cron each time the lambda gets invoked", async () => {
    await cronService(req, res)
    await cronService(req, res)
    await cronService(req, res)

    expect(db.cron.runAll).toHaveBeenCalledTimes(3)
  })

  it("establishes db connection and closes it", async () => {
    await cronService(req, res)

    expect(db.cron.runAll).toHaveBeenCalledTimes(1)

    expect(db.connect).toHaveBeenCalledTimes(1)
    expect(connection.close).toHaveBeenCalledTimes(1)
  })
})
