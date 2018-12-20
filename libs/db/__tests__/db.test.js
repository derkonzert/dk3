const db = require("..")

describe("db", () => {
  describe("userById", () => {
    it("resolves to null without _id", async () => {
      const user = await db.userById()

      expect(user).toBeNull()
    })
  })
})
