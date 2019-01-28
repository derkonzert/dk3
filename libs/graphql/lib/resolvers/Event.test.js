const { Event } = require("../../lib/resolvers/Event")

describe("Event", () => {
  describe("fancyness", () => {
    it("returns 0 or 1, dependent on the events bookmarkedBy length (currently)", async () => {
      expect.assertions(3)

      const one = await Event.fancyness({ bookmarkedBy: [1] })
      const alsoOne = await Event.fancyness({ bookmarkedBy: [1, 2, 3, 4, 5] })
      const zero = await Event.fancyness({ bookmarkedBy: [] })

      expect(one).toBe(1)
      expect(alsoOne).toBe(1)
      expect(zero).toBe(0)
    })
  })
})
