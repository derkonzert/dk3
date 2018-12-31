const mockingoose = require("mockingoose").default
const { User } = require("../lib/model/User")

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
    it("throws when password is missing", async () => {
      expect(dao.createUser(userDoc)).rejects.toThrow()
    })

    it("throws when model validation fails", async () => {
      expect(dao.createUser({ password: "123" })).rejects.toThrow()
    })

    it("returns freshly created User", async () => {
      const user = await dao.createUser({ ...userDoc, password: "password" })

      expect(user).toBeInstanceOf(User)

      expect(user.email).toEqual(userDoc.email)
    })
  })

  describe("userById", () => {
    it("throws when user not found", async () => {
      expect(dao.userById()).resolves.toBeUndefined()
    })

    it("resolves user when found", async () => {
      mockingoose.User.toReturn(userDoc, "findOne")

      const user = await dao.userById(userDoc._id)

      expect(user).toBeInstanceOf(User)
    })
  })

  describe("userByEmail", () => {
    it("throws when user not found", async () => {
      expect(dao.userByEmail()).resolves.toBeUndefined()
    })

    it("resolves user when found", async () => {
      mockingoose.User.toReturn(userDoc, "findOne")

      const user = await dao.userByEmail(userDoc.email)

      expect(user).toBeInstanceOf(User)
    })
  })
})
