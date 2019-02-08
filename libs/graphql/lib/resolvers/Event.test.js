const { Event } = require("./Event")

describe("Event", () => {
  describe("fancyness", () => {
    const allUsersCount = jest.fn()
    const cachedMethod = jest.fn().mockReturnValue(allUsersCount)
    const dao = { allUsersCount, cachedMethod }

    beforeEach(() => {
      dao.allUsersCount.mockReset()
    })

    it("returns 0 or 1, dependent on the events bookmarkedBy length and total user count", async () => {
      dao.allUsersCount.mockReturnValue(10)

      const expectedResults = [0, 0, 0, 1, 1, 2, 2]

      const callFancyess = bookmarkedBy =>
        Event.fancyness({ bookmarkedBy }, undefined, {
          dao,
        })

      const results = await Promise.all([
        callFancyess([]),
        callFancyess([1]),
        callFancyess([1, 2]),
        callFancyess([1, 2, 3]),
        callFancyess([1, 2, 3, 4]),
        callFancyess([1, 2, 3, 4, 5]),
        callFancyess([1, 2, 3, 4, 5, 6, 7]),
      ])

      expect(results).toEqual(expectedResults)
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
