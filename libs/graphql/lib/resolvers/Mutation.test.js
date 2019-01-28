const { Mutation } = require("./Mutation")

describe("Mutation", () => {
  let dao

  beforeEach(() => {
    dao = {
      createEvent: jest.fn(),
      bookmarkEvent: jest.fn(),
    }
  })

  describe("createEvent", () => {
    it("extracts event data from argument input and passes it to dao", async () => {
      const input = { some: "data" }
      const user = {}
      const expectedResult = {}
      dao.createEvent.mockReturnValue(expectedResult)

      const result = await Mutation.createEvent(
        undefined,
        { input },
        { dao, user }
      )

      expect(result).toBe(expectedResult)

      expect(dao.createEvent).toHaveBeenCalledWith(
        { eventData: expect.objectContaining(input) },
        user
      )
    })
  })

  describe("bookmarkedByMe", () => {
    it("throws when no user is in context", () => {
      expect.assertions(1)

      return expect(
        Mutation.bookmarkEvent(undefined, { input: {} }, { dao })
      ).rejects.toThrow("Unauthorized request")
    })

    it("calls dao bookmarkEvent with data from args and context", async () => {
      const expectedResult = Symbol.for("expectedResult")
      const args = { input: { id: 123, bookmarked: true } }
      const user = { _id: "j3912" }

      dao.bookmarkEvent.mockReturnValue(expectedResult)

      const result = await Mutation.bookmarkEvent(undefined, args, {
        dao,
        user,
      })

      expect(result).toBe(expectedResult)

      expect(dao.bookmarkEvent).toHaveBeenCalledWith({
        eventId: args.input.id,
        bookmarked: args.input.bookmarked,
        userId: user._id,
      })
    })
  })
})
