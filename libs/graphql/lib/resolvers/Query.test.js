const testUser = { email: "jus@email.com" }

const { Query } = require("../../lib/resolvers/Query")

describe("Query", () => {
  describe("me", () => {
    let userById

    beforeEach(() => {
      userById = jest.fn().mockReturnValue(testUser)
    })

    it("resolves to user when id is given", async () => {
      const user = await Query.me(undefined, undefined, {
        user: { _id: 123 },
        dao: { userById },
      })

      expect(user).toEqual(testUser)
    })

    it("resolves to null when no id is given", async () => {
      const user = await Query.me(undefined, undefined, { dao: { userById } })

      expect(user).toEqual(null)
    })
  })

  describe("authInfo", () => {
    const context = {
      user: {
        some: "fake",
        user: "data",
      },
    }

    it("resolves to the user object set from context", () => {
      expect(Query.authInfo(undefined, undefined, context)).toEqual(
        context.user
      )
    })

    it("resolves to null if no user object is set on context", () => {
      expect(Query.authInfo(undefined, undefined, {})).toEqual(null)
    })
  })

  describe("upcomingEvents", () => {
    it("returns upcoming events from dao", () => {
      expect.assertions(1)

      const expectedResult = [1, 2, 3]
      const context = {
        dao: {
          upcomingEvents: jest.fn().mockReturnValue(expectedResult),
        },
      }

      return expect(
        Query.upcomingEvents(undefined, undefined, context)
      ).resolves.toBe(expectedResult)
    })

    it("applies filter when it's set to 'mine'", async () => {
      const context = {
        dao: {
          upcomingEvents: jest.fn(),
        },
        user: {
          _id: "my-user-id",
        },
      }

      await Query.upcomingEvents(undefined, { filter: "mine" }, context)

      expect(context.dao.upcomingEvents).toHaveBeenCalledWith({
        filter: {
          bookmarkedBy: context.user._id,
        },
      })
    })

    it("doesnt apply filter when no user available", async () => {
      const context = {
        dao: {
          upcomingEvents: jest.fn(),
        },
      }

      await Query.upcomingEvents(undefined, { filter: "mine" }, context)

      expect(context.dao.upcomingEvents).toHaveBeenCalledWith()
    })
  })

  describe("pastEvents", () => {
    it("returns past events from dao", () => {
      expect.assertions(1)
      const expectedResult = [1, 2, 3]
      const context = {
        dao: {
          pastEvents: jest.fn().mockReturnValue(expectedResult),
        },
      }
      return expect(
        Query.pastEvents(undefined, undefined, context)
      ).resolves.toBe(expectedResult)
    })
  })

  describe("event", () => {
    it("passes the id argument down to dao", async () => {
      const context = {
        dao: {
          eventByShortId: jest.fn(),
        },
      }

      await Query.event(undefined, { id: "my-id-1234" }, context)

      expect(context.dao.eventByShortId).toHaveBeenCalledWith("my-id-1234")
    })
  })
})
