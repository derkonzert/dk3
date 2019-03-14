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

      authUtils.signIn.mockReturnValue({
        accessToken: dummyJWT,
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
        })
      )
    })
  })
})
