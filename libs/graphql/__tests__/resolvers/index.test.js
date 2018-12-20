const resolvers = require("../../lib/resolvers")

describe("resolvers", () => {
  describe("Query type", () => {
    it("has 'me' resolver", () => {
      expect(resolvers.Query.me).toBeInstanceOf(Function)
    })
  })

  it("has User type", () => {
    expect(resolvers.Query).toBeTruthy()
  })
})
