const { Event } = require("../../lib/resolvers/Event")

describe("Event", () => {
  describe("fancyness", () => {
    it("returns 0 currently", () => {
      expect.assertions(1)

      return expect(Event.fancyness()).resolves.toBe(0)
    })
  })
})
