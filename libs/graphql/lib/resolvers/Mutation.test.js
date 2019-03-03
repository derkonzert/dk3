const { Mutation } = require("./Mutation")

describe("Mutation", () => {
  let dao

  beforeEach(() => {
    dao = {
      createEvent: jest.fn(),
      bookmarkEvent: jest.fn(),
      userById: jest.fn(),
      approveEvent: jest.fn(),
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

  describe("bookmarkEvent", () => {
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

  describe("approveEvent", () => {
    it("throws when no user is in context", () => {
      expect.assertions(1)

      return expect(
        Mutation.approveEvent(undefined, { input: {} }, { dao })
      ).rejects.toThrow("Unauthorized request")
    })

    it("throws when user doesnt have the required skill", () => {
      const args = { input: { id: 123, bookmarked: true } }
      const user = { _id: "j3912" }
      const hasSkill = jest.fn()
      const userModel = { hasSkill }

      hasSkill.mockReturnValue(false)
      dao.userById.mockReturnValueOnce(userModel)

      return expect(
        Mutation.approveEvent(undefined, args, { dao, user })
      ).rejects.toThrow("Unauthorized request")
    })

    it("calls dao approveEvent with data from args and context", async () => {
      const expectedResult = Symbol.for("expectedResult")
      const args = { input: { id: 123, approved: true } }
      const user = { _id: "j3912" }
      const hasSkill = jest.fn()
      const userModel = { hasSkill }

      hasSkill.mockReturnValue(true)
      dao.approveEvent.mockReturnValue(expectedResult)
      dao.userById.mockReturnValueOnce(userModel)

      const result = await Mutation.approveEvent(undefined, args, {
        dao,
        user,
      })

      expect(result).toBe(expectedResult)

      expect(dao.approveEvent).toHaveBeenCalledWith({
        eventId: args.input.id,
        approved: args.input.approved,
      })
    })
  })
})
