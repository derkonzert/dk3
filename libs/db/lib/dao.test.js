const User = require("../lib/model/User")
const Event = require("../lib/model/Event")
const SystemEvent = require("../lib/model/SystemEvent")

jest.mock("../lib/model/User", () => ({
  Model: {},
}))
jest.mock("../lib/model/SystemEvent", () => ({
  Model: {},
  Types: {
    eventAdded: "event:added",
  },
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
  describe("cachedMethod", () => {
    beforeEach(() => {
      dao._now = dao.now
      dao.now = jest.fn()
    })
    afterEach(() => {
      dao.now = dao._now
    })

    it("only calls the actual method once, until ttl has ended", async () => {
      const fn = jest.fn().mockImplementation(val => val + 1)

      dao.now.mockReturnValue(Date.now())

      const cached = dao.cachedMethod("key", fn, { ttl: 30000 })

      const results = [await cached(0), await cached(1), await cached(2)]

      expect(results).toEqual([1, 1, 1])
      expect(fn).toHaveBeenCalledTimes(1)

      dao.now.mockReturnValue(Date.now() + 30000)

      const result = await cached(2)

      expect(result).toBe(3)
      expect(fn).toHaveBeenCalledTimes(2)
    })

    it("caches the cached method per key", () => {
      const fn = () => {}

      expect(dao.cachedMethod("key", fn, { ttl: 500 })).toBe(
        dao.cachedMethod("key", fn, { ttl: 500 })
      )

      expect(dao.cachedMethod("key", fn, { ttl: 500 })).not.toBe(
        dao.cachedMethod("otherKey", fn, { ttl: 500 })
      )
    })
  })

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

  describe("allUsersCount", () => {
    const userCount = 40

    beforeEach(() => {
      User.Model.estimatedDocumentCount = jest.fn().mockReturnValue(User.Model)
      User.Model.exec = jest.fn().mockResolvedValue(userCount)
    })

    it("calls estimatedDocumentCount", async () => {
      const count = await dao.allUsersCount()

      expect(User.Model.estimatedDocumentCount).toHaveBeenCalledTimes(1)
      expect(count).toBe(userCount)
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

  describe("updateUser", () => {
    const updateUserData = {
      shortId: 1,
      username: "newname",
      sendEmails: true,
      other: "123",
    }
    let findOneExec
    let findOneAndUpdateExec

    beforeEach(() => {
      findOneExec = jest.fn().mockReturnValue(userDoc)
      findOneAndUpdateExec = jest.fn().mockReturnValue(userDoc)
      User.Model.findOneAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: findOneAndUpdateExec })
      User.Model.findOne = jest.fn().mockReturnValue({ exec: findOneExec })
    })

    it("calls findOneAndUpdate on User model", async () => {
      await dao.updateUser(updateUserData)

      expect(User.Model.findOneAndUpdate).toHaveBeenCalledWith(
        {
          shortId: updateUserData.shortId,
        },
        {
          username: updateUserData.username,
          sendEmails: updateUserData.sendEmails,
        }
      )
      expect(findOneAndUpdateExec).toHaveBeenCalledTimes(1)
    })

    it("returns result from User findOne", async () => {
      const result = await dao.updateUser(updateUserData)

      expect(result).toBe(userDoc)
      expect(User.Model.findOne).toHaveBeenCalledWith({
        shortId: updateUserData.shortId,
      })
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

  describe("createEvent", () => {
    const eventData = {
      title: "One two",
      artists: ["check"],
      from: new Date(),
    }

    beforeEach(() => {
      SystemEvent.Model.create = jest.fn()
    })

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

    it("adds author to bookmarkedBy when autoBookmark is set", async () => {
      const event = await dao.createEvent(
        { eventData, autoBookmark: true },
        { _id: "1234" }
      )

      expect(event.data).toMatchObject({
        ...eventData,
        bookmarkedBy: ["1234"],
        author: "1234",
      })
    })

    it("creates system event", async () => {
      const event = await dao.createEvent(
        { eventData, autoBookmark: true },
        { _id: "1234" }
      )

      expect(SystemEvent.Model.create).toHaveBeenCalledWith({
        type: SystemEvent.Types.eventAdded,
        relatedEvent: event._id,
        emittedBy: "1234",
      })
    })
  })

  describe("allEventsCount", () => {
    const eventCount = 40

    beforeEach(() => {
      Event.Model.estimatedDocumentCount = jest
        .fn()
        .mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockResolvedValue(eventCount)
    })

    it("calls estimatedDocumentCount", async () => {
      const count = await dao.allEventsCount()

      expect(Event.Model.estimatedDocumentCount).toHaveBeenCalledTimes(1)
      expect(count).toBe(eventCount)
    })
  })

  describe("bookmarkEvent", () => {
    beforeEach(() => {
      Event.Model.findOneAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: () => {} })

      Event.Model.findOne = jest.fn().mockReturnValue({ exec: () => {} })
    })

    it("adds user to bookmarkedBy if 'bookmarked' is truthy", async () => {
      await dao.bookmarkEvent({
        eventShortId: "event-id",
        bookmarked: true,
        userId: "user-id",
      })

      expect(Event.Model.findOneAndUpdate).toHaveBeenCalledWith(
        { shortId: "event-id" },
        expect.objectContaining({
          $push: {
            bookmarkedBy: "user-id",
          },
        })
      )
    })

    it("removes user from bookmarkedBy if 'bookmarked' is truthy", async () => {
      await dao.bookmarkEvent({
        eventShortId: "event-id",
        bookmarked: false,
        userId: "user-id",
      })

      expect(Event.Model.findOneAndUpdate).toHaveBeenCalledWith(
        { shortId: "event-id" },
        expect.objectContaining({
          $pull: {
            bookmarkedBy: "user-id",
          },
        })
      )
    })

    it("throws when updating fails", () => {
      Event.Model.findOneAndUpdate.mockImplementation(() => {
        throw new Error("Maybe the document wasnt found?")
      })

      expect.assertions(1)

      return expect(
        dao.bookmarkEvent({
          eventShortId: "event-id",
          bookmarked: false,
          userId: "user-id",
        })
      ).rejects.toThrow("Maybe the document wasnt found?")
    })
  })

  describe("approveEvent", () => {
    beforeEach(() => {
      Event.Model.findOneAndUpdate = jest
        .fn()
        .mockReturnValue({ exec: () => {} })

      Event.Model.findOne = jest.fn().mockReturnValue({ exec: () => {} })
    })

    it("throws when updating the event fails", async () => {
      expect.assertions(1)

      Event.Model.findOneAndUpdate.mockImplementation(() => {
        throw new Error("Uh Oh")
      })

      return expect(
        dao.approveEvent({
          eventShortId: "event-id",
          approved: Symbol.for("approved"),
        })
      ).rejects.toThrow("Uh Oh")
    })

    it("updates event with given approved value", async () => {
      await dao.approveEvent({
        eventShortId: "event-id",
        approved: Symbol.for("approved"),
      })

      expect(Event.Model.findOneAndUpdate).toHaveBeenCalledWith(
        { shortId: "event-id" },
        expect.objectContaining({
          approved: Symbol.for("approved"),
        })
      )
    })
  })

  describe("allEvents", () => {
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

  describe("pastEvents", () => {
    beforeEach(() => {
      Event.Model.find = jest.fn().mockReturnValue(Event.Model)
      Event.Model.sort = jest.fn().mockReturnValue(Event.Model)
      Event.Model.skip = jest.fn().mockReturnValue(Event.Model)
      Event.Model.limit = jest.fn().mockReturnValue(Event.Model)
      Event.Model.exec = jest.fn().mockReturnValue(Event.Model)
    })

    it("calls find on model", async () => {
      await dao.pastEvents({})

      expect(Event.Model.find).toHaveBeenCalledWith({
        to: { $lt: expect.any(Date) },
      })
      expect(Event.Model.sort).toHaveBeenCalledWith({ from: -1 })
      expect(Event.Model.exec).toHaveBeenCalled()
    })

    it("paginates db requests", async () => {
      await dao.pastEvents({
        page: 2,
        perPage: 60,
      })

      expect(Event.Model.skip).toHaveBeenCalledWith(2 * 60)
      expect(Event.Model.limit).toHaveBeenCalledWith(60)
      expect(Event.Model.exec).toHaveBeenCalled()
    })
  })

  describe("upcomingEvents", () => {
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
