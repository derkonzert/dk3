const dao = require("../lib/dao")
const { connect } = require("../lib/connect")
const db = require("..")

describe("db", () => {
  it("exports dao", () => {
    expect(db.dao).toEqual(dao)
  })

  it("exports connect", async () => {
    expect(db.connect).toEqual(connect)
  })
})
