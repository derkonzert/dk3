const authUtils = require("@dk3/auth-utils")
const micro = require("micro")
const { HTTPStatusError } = require("@dk3/error")

const apiUtils = require("@dk3/api-utils")
jest.mock("@dk3/api-utils")
apiUtils.sendJson = jest.fn()

const db = require("@dk3/db")
jest.mock("@dk3/db")
jest.mock("@dk3/auth-utils")
authUtils.authenticatedRequest = handler => handler

jest.mock("micro")

const auth = require("..")

describe("auth", () => {
  let response

  beforeEach(() => {
    apiUtils.sendJson.mockReset()
    response = {
      foo: "bar",
    }
  })

  it("establishes db connection (once)", async () => {
    db.connect.mockReturnValue(true)

    await auth({ url: "/any" }, response)

    await auth({ url: "/any" }, response)

    expect(db.connect).toHaveBeenCalledTimes(1)
  })

  it("handles non matched routes", async () => {
    await auth({ url: "/?operation=non-existing" }, response)

    expect(apiUtils.sendJson).toBeCalledWith(response, 404, {
      message: expect.anything(),
    })
  })

  it("handles server errors", async () => {
    micro.json.mockImplementation(() => {
      throw new Error("Uh oh")
    })

    await auth({ url: "/?operation=signIn" }, response)

    expect(apiUtils.sendJson).toBeCalledWith(
      response,
      500,
      expect.objectContaining({
        message: "Uh oh",
      })
    )
  })

  describe("verify-email", () => {
    it("calls verify-email helper with token from resp body", async () => {
      const token = "some_token_123"

      micro.json.mockReturnValue({
        token,
      })

      await auth({ url: "/?operation=verify-email" }, response)

      expect(authUtils.verifyEmail).toHaveBeenCalledWith(token)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when no token is given", async () => {
      micro.json.mockReturnValue({})

      await auth({ url: "/?operation=verify-email" }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "No token to verify, status=400",
      })
    })

    it("throws when password reset helper fails", async () => {
      const token = "some_token_123"

      micro.json.mockReturnValue({
        token,
      })

      authUtils.verifyEmail.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth({ url: "/?operation=verify-email" }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("requestPasswordReset", () => {
    it("calls password reset helper with email from resp body", async () => {
      const email = "some@email.come"

      micro.json.mockReturnValue({
        email,
      })

      await auth({ url: "/?operation=requestPasswordReset" }, response)

      expect(authUtils.requestPasswordReset).toHaveBeenCalledWith(email)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when password reset helper fails", async () => {
      authUtils.requestPasswordReset.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth({ url: "/?operation=requestPasswordReset" }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("passwordReset", () => {
    it("calls password reset helper with token and password from resp body", async () => {
      const token = "123fasdf"
      const password = "some!password1"

      micro.json.mockReturnValue({
        token,
        password,
      })

      await auth({ url: "/?operation=passwordReset" }, response)

      expect(authUtils.passwordReset).toHaveBeenCalledWith(token, password)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when password reset helper fails", async () => {
      authUtils.passwordReset.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth({ url: "/?operation=passwordReset" }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("signUp handler", () => {
    it("registers new users", async () => {
      authUtils.signUp.mockResolvedValue(true)
      micro.json.mockReturnValue({
        email: "jus@email.com",
        password: "password",
        username: "ju",
      })

      await auth({ url: "/?operation=signUp" }, response)

      expect(apiUtils.sendJson).toBeCalledWith(
        response,
        201,
        expect.objectContaining({ message: expect.any(String) })
      )
    })

    it("handles user creation errors", async () => {
      authUtils.signUp.mockImplementation(() => {
        throw new Error("uh oh")
      })

      await auth({ url: "/?operation=signUp" }, response)

      expect(apiUtils.sendJson).toBeCalledWith(response, 400, {
        message: expect.anything(),
      })
    })
  })

  describe("signIn", () => {
    it("sets status code if signIn fails", async () => {
      const credentials = {
        email: "invalid@email.com",
        password: "invalid password",
      }
      micro.json.mockReturnValue(credentials)

      authUtils.signIn.mockImplementation(async () => {
        throw new HTTPStatusError({ title: "No user found", statusCode: 401 })
      })

      await auth({ url: "/?operation=signIn" }, response)

      expect(authUtils.signIn).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      )

      // expect(response.status).toBeCalledWith(401)
      expect(apiUtils.sendJson).toBeCalledWith(
        response,
        401,
        expect.objectContaining({
          message: expect.stringContaining("No user found"),
        })
      )
    })

    it("returns JWT token for valid credentials", async () => {
      const credentials = {
        email: "jus@email.com",
        password: "password",
      }
      micro.json.mockReturnValue(credentials)

      const dummyJWT = "someFakeJwtToken"
      const expectedLastLogin = new Date()

      authUtils.signIn.mockReturnValue({
        accessToken: dummyJWT,
        lastLogin: expectedLastLogin,
      })

      await auth({ url: "/?operation=signIn" }, response)

      expect(authUtils.signIn).toHaveBeenCalledWith(
        credentials.email,
        credentials.password
      )

      expect(apiUtils.sendJson).toBeCalledWith(
        response,
        200,
        expect.objectContaining({
          accessToken: dummyJWT,
          lastLogin: expectedLastLogin,
        })
      )
    })
  })
})
