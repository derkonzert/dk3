const User = require("../lib/model/User")
const Event = require("../lib/model/Event")

jest.mock("../lib/model/User", () => ({
  Model: {},
}))
jest.mock("../lib/model/Event", () => ({
  Model: {
    create: data => ({ mock: Symbol.for("create"), data }),
  },
}))

const dao = require("../lib/dao")

const userDoc = {
  _id: "5c2a073a8f4b761b5fc9ce72",
  username: "ju",
  email: "jus@email.com",
}

describe("dao", () => {
  describe("createUser", () => {
    beforeEach(() => {
      User.Model.create = jest.fn().mockReturnValue(userDoc)
      User.Model.createPasswordHash = jest.fn().mockReturnValue("hash")
    })

    it("throws when password is missing", () => {
      User.Model.createPasswordHash.mockImplementation(() => {
        throw new Error("something went wrong")
      })

      expect.assertions(1)

      return expect(dao.createUser(userDoc)).rejects.toThrow()
    })

    it("throws when model creation fails", () => {
      User.Model.create.mockImplementation(() => {
        throw new Error("Something went wrong")
      })

      expect.assertions(1)

      return expect(
        dao.createUser({ password: "123", email: "kfae" })
      ).rejects.toThrow("Something went wrong")
    })

    it("returns freshly created User", async () => {
      const user = await dao.createUser({ ...userDoc, password: "password" })

      expect(user).toEqual(userDoc)
    })
  })

  describe("userById", () => {
    beforeEach(() => {
      User.Model.findById = jest.fn().mockReturnValue(User.Model)
      User.Model.exec = jest.fn().mockResolvedValue(userDoc)
    })

    it("calls Model find function with given ID", async () => {
      await dao.userById("my id")

      expect(User.Model.findById).toHaveBeenCalledWith("my id")
    })

    it("throws when user not found", async () => {
      User.Model.exec = jest.fn().mockResolvedValue(undefined)

      expect.assertions(2)

      const result = await dao.userById()

      expect(User.Model.findById).toBeCalledWith(undefined)

      return expect(result).toBeUndefined()
    })

    it("resolves user when found", async () => {
      const user = await dao.userById(userDoc._id)

      expect(user).toEqual(userDoc)
    })
  })

  describe("userByEmail", () => {
    beforeEach(() => {
      User.Model.findOne = jest.fn().mockReturnValue(User.Model)
      User.Model.exec = jest.fn().mockResolvedValue(userDoc)
    })

    it("calls Model find function with given email", async () => {
      await dao.userByEmail("my@email.com")

      expect(User.Model.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ email: "my@email.com" })
      )
    })

    it("throws when user not found", () => {
      expect.assertions(1)

      User.Model.exec = jest.fn().mockImplementation(() => {
        throw new Error("No user found")
      })

      return expect(dao.userByEmail()).rejects.toThrow()
    })

    it("resolves user when found", async () => {
      const user = await dao.userByEmail(userDoc.email)

      expect(user).toBe(userDoc)
    })
  })

  /* Event methods */

  describe("eventById", () => {
    const expectedResult = Symbol.for("event")

    beforeEach(() => {
      Event.Model.findById = jest.fn().mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockReturnValue(expectedResult)
    })

    it("calls Model find function with given ID", async () => {
      await dao.eventById("my id")

      expect(Event.Model.findById).toHaveBeenCalledWith("my id")
    })

    it("throws when event not found", async () => {
      expect.assertions(1)

      Event.Model.exec = jest.fn().mockImplementation(() => {
        throw new Error("event not found")
      })

      return expect(dao.eventById("failing id")).rejects.toThrow(
        "event not found"
      )
    })

    it("resolves to event when found", async () => {
      const user = await dao.eventById("some_id")

      expect(Event.Model.findById).toBeCalledWith("some_id")

      expect(user).toBe(expectedResult)
    })
  })

  describe("createEvent", async () => {
    const eventData = {
      title: "One two",
      artists: ["check"],
      from: new Date(),
    }

    it("throws on invalid data", () => {
      expect.assertions(1)

      return expect(dao.createEvent()).rejects.toThrow()
    })

    it("returns a new Event", async () => {
      const event = await dao.createEvent({ eventData })

      expect(event.mock).toBe(Symbol.for("create"))
      expect(event.data).toMatchObject({ ...eventData, author: undefined })
    })

    it("doesnt set author when user._id is not given", async () => {
      const event = await dao.createEvent({ eventData }, { username: "uhoh" })

      expect(event.data).toMatchObject({ ...eventData, author: undefined })
    })

    it("sets author when user is given", async () => {
      const event = await dao.createEvent({ eventData }, { _id: "1234" })

      expect(event.data).toMatchObject({ ...eventData, author: "1234" })
    })

    it("adds author to likedBy when autoLike is set", async () => {
      const event = await dao.createEvent(
        { eventData, autoLike: true },
        { _id: "1234" }
      )

      expect(event.data).toMatchObject({
        ...eventData,
        likedBy: ["1234"],
        author: "1234",
      })
    })
  })

  describe("likeEvent", async () => {
    beforeEach(() => {
      Event.Model.findByIdAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: () => {} })

      Event.Model.findById = jest.fn().mockReturnValue({ exec: () => {} })
    })

    it("adds user to likedBy 'like' is truthy", async () => {
      await dao.likeEvent("event-id", true, "user-id")

      expect(Event.Model.findByIdAndUpdate).toHaveBeenCalledWith(
        "event-id",
        expect.objectContaining({
          $push: {
            likedBy: "user-id",
          },
        })
      )
    })

    it("removes user from likedBy 'like' is truthy", async () => {
      await dao.likeEvent("event-id", false, "user-id")

      expect(Event.Model.findByIdAndUpdate).toHaveBeenCalledWith(
        "event-id",
        expect.objectContaining({
          $pull: {
            likedBy: "user-id",
          },
        })
      )
    })

    it("throws when updating fails", () => {
      Event.Model.findByIdAndUpdate.mockImplementation(() => {
        throw new Error("Maybe the document wasnt found?")
      })

      expect.assertions(1)

      return expect(
        dao.likeEvent("event-id", false, "user-id")
      ).rejects.toThrow("Maybe the document wasnt found?")
    })
  })

  describe("allEvents", async () => {
    beforeEach(() => {
      Event.Model.find = jest.fn().mockReturnValue(Event.Model)
      Event.Model.sort = jest.fn().mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockReturnValue(Event.Model)
    })

    it("calls find on model", async () => {
      await dao.allEvents()

      expect(Event.Model.find).toHaveBeenCalledWith({})
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: 1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })

    it("extends filter and sort arguments", async () => {
      await dao.allEvents({
        filter: { custom: "filter" },
        sort: { location: 1 },
      })

      expect(Event.Model.find).toHaveBeenCalledWith({
        custom: "filter",
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: 1, location: 1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })
  })

  describe("pastEvents", async () => {
    beforeEach(() => {
      Event.Model.find = jest.fn().mockReturnValue(Event.Model)
      Event.Model.sort = jest.fn().mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockReturnValue(Event.Model)
    })

    it("calls find on model", async () => {
      await dao.pastEvents()

      expect(Event.Model.find).toHaveBeenCalledWith({
        to: { $lt: expect.any(Date) },
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: -1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })

    it("extends filter and sort arguments", async () => {
      await dao.pastEvents({
        filter: { custom: "filter" },
        sort: { location: 1 },
      })

      expect(Event.Model.find).toHaveBeenCalledWith({
        custom: "filter",
        to: { $lt: expect.any(Date) },
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: -1, location: 1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })
  })

  describe("upcomingEvents", async () => {
    beforeEach(() => {
      Event.Model.find = jest.fn().mockReturnValue(Event.Model)
      Event.Model.sort = jest.fn().mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockReturnValue(Event.Model)
    })

    it("calls find on model", async () => {
      await dao.upcomingEvents()

      expect(Event.Model.find).toHaveBeenCalledWith({
        to: { $gte: expect.any(Date) },
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: 1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })

    it("extends filter and sort arguments", async () => {
      await dao.upcomingEvents({
        filter: { custom: "filter" },
        sort: { location: 1 },
      })

      expect(Event.Model.find).toHaveBeenCalledWith({
        custom: "filter",
        to: { $gte: expect.any(Date) },
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: 1, location: 1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })
  })
})
