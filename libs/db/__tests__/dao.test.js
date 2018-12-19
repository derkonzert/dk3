const dao = require("../lib/dao");

describe("dao", () => {
  describe("userById", () => {
    it("resolves to null without _id", async () => {
      const user = await dao.userById();

      expect(user).toBeNull();
    });
  });
});
