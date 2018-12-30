const authUtils = require("@dk3/auth-utils")
jest.mock("@dk3/auth-utils")

const { getContextFromRequest } = require("../lib/getContextFromRequest")

describe("getContextFromRequest", () => {
  const user = {}
  const req = {}

  beforeEach(() => {
    authUtils.getUserFromRequest.mockImplementation(recievedReq => {
      if (recievedReq === req) {
        return user
      }
      throw new Error("getUserFromRequest mock failed")
    })
  })

  it("resets req.url to actual url", async () => {
    const contextObject = await getContextFromRequest({ req })

    expect(contextObject.user).toBe(user)
  })

  it("resolves to empty object if user retrieval fails for whatever reason", async () => {
    const contextObject = await getContextFromRequest({})

    expect(contextObject.user).toBe(undefined)
  })
})
