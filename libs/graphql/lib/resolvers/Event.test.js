const { Event } = require("./Event")

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

  describe("bookmarkedByMe", () => {
    it("resolves to false if there is no user", () => {
      expect.assertions(1)

      return expect(
        Event.bookmarkedByMe(undefined, undefined, {})
      ).resolves.toBe(false)
    })

    it("resolves to false if the users ID doesnt appear in bookmarkedBy", () => {
      expect.assertions(1)

      return expect(
        Event.bookmarkedByMe({ bookmarkedBy: [] }, undefined, {
          user: { _id: "1234" },
        })
      ).resolves.toBe(false)
    })

    it("resolves to true if the users ID does appear in bookmarkedBy", () => {
      expect.assertions(1)

      return expect(
        Event.bookmarkedByMe({ bookmarkedBy: ["1234"] }, undefined, {
          user: { _id: "1234" },
        })
      ).resolves.toBe(true)
    })
  })
})
