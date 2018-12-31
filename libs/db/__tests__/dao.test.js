const mockingoose = require("mockingoose").default
const User = require("../lib/model/User")
const Event = require("../lib/model/Event")

jest.mock("../lib/model/Event", () => ({
  Model: {
    create: data => ({ mock: Symbol.for("create"), data }),
    // findByIdAndUpdate: data => ({
    //   mock: Symbol.for("findByIdAndUpdate"),
    //   data,
    // }),
  },
}))

const dao = require("../lib/dao")

const userDoc = {
  _id: "5c2a073a8f4b761b5fc9ce72",
  username: "ju",
  email: "jus@email.com",
}

describe("dao", () => {
  beforeEach(() => {
    mockingoose.resetAll()
  })

  describe("createUser", () => {
    it("throws when password is missing", () => {
      expect(dao.createUser(userDoc)).rejects.toThrow()
    })

    it("throws when model validation fails", () => {
      expect(dao.createUser({ password: "123" })).rejects.toThrow()
    })

    it("returns freshly created User", async () => {
      const user = await dao.createUser({ ...userDoc, password: "password" })

      expect(user).toBeInstanceOf(User.Model)

      expect(user.email).toEqual(userDoc.email)
    })
  })

  describe("userById", () => {
    it("throws when user not found", () => {
      expect(dao.userById()).resolves.toBeUndefined()
    })

    it("resolves user when found", async () => {
      mockingoose.User.toReturn(userDoc, "findOne")

      const user = await dao.userById(userDoc._id)

      expect(user).toBeInstanceOf(User.Model)
    })
  })

  describe("userByEmail", () => {
    it("throws when user not found", () => {
      expect(dao.userByEmail()).resolves.toBeUndefined()
    })

    it("resolves user when found", async () => {
      mockingoose.User.toReturn(userDoc, "findOne")

      const user = await dao.userByEmail(userDoc.email)

      expect(user).toBeInstanceOf(User.Model)
    })
  })

  /* Event methods */
  describe("createEvent", async () => {
    const eventData = {
      title: "One two",
      artists: ["check"],
      from: new Date(),
    }

    it("throws on invalid data", () => {
      expect(dao.createEvent()).rejects.toThrow()
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

      expect(dao.likeEvent("event-id", false, "user-id")).rejects.toThrow(
        "Maybe the document wasnt found?"
      )
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
