const { User } = require("../lib/model/User")
const db = require("..")

describe("db", () => {
  describe("userById", () => {
    it("resolves to null without _id", async () => {
      const user = await db.userById()

      expect(user).toBeNull()
    })

    it("resolves to dummy user with special _id", async () => {
      const user = await db.userById(1234)

      expect(user).toBeInstanceOf(User)
    })
  })
})
