const authUtils = require("@dk3/auth-utils")
jest.mock("@dk3/auth-utils")

const { context } = require("../lib/context")

describe("context", () => {
  const user = {}
  const req = {}

  beforeEach(() => {
    authUtils.getUserFromRequest.mockImplementation(req => {
      if (req === req) {
        return user
      }
      return null
    })
  })

  it("resets req.url to actual url", async () => {
    const contextObject = await context(req)

    expect(contextObject.user).toBe(user)
  })
})
