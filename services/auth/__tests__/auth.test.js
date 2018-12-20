const authUtils = require("@dk3/auth-utils")
const micro = require("micro")

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
    expect(response.json).toBeCalledWith(
      expect.objectContaining({
        message: "not found",
      })
    )
  })

  it("has a register handler", async () => {
    const dummyUser = { fullName: "Ju", email: "jus@email.com" }
    authUtils.register.mockReturnValue(dummyUser)

    await auth({ url: "/?operation=register" }, response)

    /* Registering currently hardcoded */
    expect(response.json).toBeCalledWith(expect.objectContaining(dummyUser))
  })

  describe("dummy 'secured' case", () => {
    it("returns user when set on request", async () => {
      const user = {}
      await auth({ url: "/?operation=secured", user }, response)

      expect(response.json).toBeCalledWith(user)
    })

    it("returns 'anonymous' without user", async () => {
      await auth({ url: "/?operation=secured" }, response)

      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          anonymous: true,
        })
      )
    })
  })

  describe("signIn", () => {
    it("sets 401 for invalid email", async () => {
      micro.json.mockReturnValue({
        email: "invalid@email.com",
        password: "invalid password",
      })

      authUtils.signIn.mockReturnValue(undefined)

      await auth({ url: "/?operation=signIn" }, response)

      expect(response.status).toBeCalledWith(401)
      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          message: "Invalid Credentials",
        })
      )
    })

    it("sets 401 for invalid password", async () => {
      micro.json.mockReturnValue({
        email: "jus@email.com",
        password: "invalid password",
      })

      authUtils.signIn.mockReturnValue(undefined)

      await auth({ url: "/?operation=signIn" }, response)

      expect(response.status).toBeCalledWith(401)
      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          message: "Invalid Credentials",
        })
      )
    })

    it("returns JWT token for valid credentials", async () => {
      micro.json.mockReturnValue({
        email: "jus@email.com",
        password: "password",
      })

      const dummyJWT = "someFakeJwtToken"

      authUtils.signIn.mockReturnValue(dummyJWT)

      await auth({ url: "/?operation=signIn" }, response)

      expect(response.json).toBeCalledWith(
        expect.objectContaining({
          token: dummyJWT,
        })
      )
    })
  })
})
