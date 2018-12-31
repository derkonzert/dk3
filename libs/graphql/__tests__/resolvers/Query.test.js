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

  describe("upcoming", () => {
    it("returns upcoming events from dao", async () => {
      const expectedResult = [1, 2, 3]
      const context = {
        dao: {
          upcomingEvents: jest.fn().mockReturnValue(expectedResult),
        },
      }
      expect(Query.upcoming(undefined, undefined, context)).resolves.toBe(
        expectedResult
      )
    })
  })
})
