const authUtils = require("@dk3/auth-utils")

const { HTTPStatusError } = require("@dk3/error")

const apiUtils = require("@dk3/api-utils")
jest.mock("@dk3/api-utils")
apiUtils.sendJson = jest.fn()

const db = require("@dk3/db")
jest.mock("@dk3/db")
jest.mock("@dk3/auth-utils")
authUtils.authenticatedRequest = handler => handler

const auth = require("./auth")

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

    await auth("any", { url: "/any" }, response)

    await auth("any", { url: "/any" }, response)

    expect(db.connect).toHaveBeenCalledTimes(1)
  })

  it("handles non matched routes", async () => {
    await auth("non-existing", {}, response)

    expect(apiUtils.sendJson).toBeCalledWith(response, 404, {
      message: expect.anything(),
    })
  })

  it.skip("handles server errors", async () => {
    // TODO: mock server error

    await auth("signIn", {}, response)

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

      await auth("verify-email", { body: { token } }, response)

      expect(authUtils.verifyEmail).toHaveBeenCalledWith(token)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when no token is given", async () => {
      await auth("verify-email", { body: {} }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "No token to verify, status=400",
      })
    })

    it("throws when password reset helper fails", async () => {
      const token = "some_token_123"

      authUtils.verifyEmail.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth("verify-email", { body: { token } }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("requestPasswordReset", () => {
    it("calls password reset helper with email from resp body", async () => {
      const email = "some@email.come"

      await auth("requestPasswordReset", { body: { email } }, response)

      expect(authUtils.requestPasswordReset).toHaveBeenCalledWith(email)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when password reset helper fails", async () => {
      authUtils.requestPasswordReset.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth("requestPasswordReset", { body: {} }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("passwordReset", () => {
    it("calls password reset helper with token and password from resp body", async () => {
      const token = "123fasdf"
      const password = "some!password1"

      await auth("passwordReset", { body: { token, password } }, response)

      expect(authUtils.passwordReset).toHaveBeenCalledWith(token, password)
      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 200, {
        message: expect.any(String),
      })
    })

    it("throws when password reset helper fails", async () => {
      const token = "123fasdf"
      const password = "some!password1"

      authUtils.passwordReset.mockImplementationOnce(() => {
        throw new Error("something doesnt add up")
      })

      await auth("passwordReset", { body: { token, password } }, response)

      expect(apiUtils.sendJson).toHaveBeenCalledWith(response, 400, {
        message: "something doesnt add up, status=400",
      })
    })
  })

  describe("signUp handler", () => {
    it("registers new users", async () => {
      authUtils.signUp.mockResolvedValue(true)
      const body = {
        email: "jus@email.com",
        password: "password",
        username: "ju",
      }

      await auth("signUp", { body }, response)

      expect(apiUtils.sendJson).toBeCalledWith(
        response,
        201,
        expect.objectContaining({ message: expect.any(String) })
      )
    })

    it("handles user creation errors", async () => {
      const body = {
        email: "jus@email.com",
        password: "password",
        username: "ju",
      }

      authUtils.signUp.mockImplementation(() => {
        throw new Error("uh oh")
      })

      await auth("signUp", { body }, response)

      expect(apiUtils.sendJson).toBeCalledWith(response, 400, {
        message: expect.anything(),
      })
    })
  })

  describe("signIn", () => {
    it("sets status code if signIn fails", async () => {
      const body = {
        email: "invalid@email.com",
        password: "invalid password",
      }

      authUtils.signIn.mockImplementation(async () => {
        throw new HTTPStatusError({ title: "No user found", statusCode: 401 })
      })

      await auth("signIn", { body }, response)

      expect(authUtils.signIn).toHaveBeenCalledWith(body.email, body.password)

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
      const body = {
        email: "jus@email.com",
        password: "password",
      }

      const dummyJWT = "someFakeJwtToken"
      const expectedLastLogin = new Date()

      authUtils.signIn.mockReturnValue({
        accessToken: dummyJWT,
        lastLogin: expectedLastLogin,
      })

      await auth("signIn", { body }, response)

      expect(authUtils.signIn).toHaveBeenCalledWith(body.email, body.password)

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
