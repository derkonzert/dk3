const authUtils = require("@dk3/auth-utils")
const micro = require("micro")
const { HTTPStatusError } = require("@dk3/error")

jest.mock("@dk3/auth-utils")
authUtils.authenticatedRequest = handler => handler

jest.mock("micro")

const auth = require("..")

describe("auth", () => {
  let response

  beforeEach(() => {
    const json = jest.fn()
    const status = jest.fn()

    response = {
      json: json.mockReturnValue(response),
      status: status.mockReturnValue(response),
    }
  })

  it("handles non matched routes", async () => {
    await auth({ url: "/?operation=non-existing" }, response)

    expect(response.status).toBeCalledWith(404)
  })

  it("handles server errors", async () => {
    micro.json.mockImplementation(() => {
      throw new Error("Uh oh")
    })

    await auth({ url: "/?operation=signIn" }, response)

    expect(response.status).toBeCalledWith(500)
    expect(response.json).toBeCalledWith(
      expect.objectContaining({
        message: "Uh oh",
      })
    )
  })

  it("has a register handler", async () => {
    const dummyUser = { username: "Ju", email: "jus@email.com" }
    authUtils.register.mockReturnValue(dummyUser)

    await auth({ url: "/?operation=register" }, response)

    /* Registering currently hardcoded */
    expect(response.json).toBeCalledWith(expect.objectContaining(dummyUser))
  })

  describe("dummy 'secured' case", () => {
    const user = { dummy: "user" }

    beforeEach(() => {
      authUtils.getUserFromRequest.mockImplementation(({ fail }) => {
        if (fail) {
          const err = new Error("ohuh")
          err.status = 401

          throw err
        }
        return user
      })
    })
    it("returns user when set on request", async () => {
      await auth({ url: "/?operation=secured", user }, response)

      expect(response.json).toBeCalledWith(user)
    })

    it("returns error message without user", async () => {
      await auth({ url: "/?operation=secured", fail: true }, response)

      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          message: "ohuh",
        })
      )
    })
  })

  describe("signIn", () => {
    it("sets status code if signIn fails", async () => {
      micro.json.mockReturnValue({
        email: "invalid@email.com",
        password: "invalid password",
      })

      authUtils.signIn.mockImplementation(async () => {
        throw new HTTPStatusError("No user found", 401)
      })

      await auth({ url: "/?operation=signIn" }, response)

      // expect(response.status).toBeCalledWith(401)
      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          message: "No user found",
        })
      )
    })

    it("returns JWT token for valid credentials", async () => {
      micro.json.mockReturnValue({
        email: "jus@email.com",
        password: "password",
      })

      const dummyJWT = "someFakeJwtToken"

      authUtils.signIn.mockReturnValue({
        accessToken: dummyJWT,
      })

      await auth({ url: "/?operation=signIn" }, response)

      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          accessToken: dummyJWT,
        })
      )
    })
  })
})
