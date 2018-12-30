const testUser = { email: "jus@email.com" }

const { me } = require("../../lib/resolvers/me")

describe("me", () => {
  let userById

  beforeEach(() => {
    userById = jest.fn().mockReturnValue(testUser)
  })

  it("resolves to user when id is given", async () => {
    const user = await me(undefined, undefined, {
      user: { _id: 123 },
      db: { userById },
    })

    expect(user).toEqual(testUser)
  })

  it("resolves to null when no id is given", async () => {
    const user = await me(undefined, undefined, { db: { userById } })

    expect(user).toEqual(null)
  })
})
