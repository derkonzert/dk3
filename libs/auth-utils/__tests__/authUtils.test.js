const jwt = require("jsonwebtoken")
const { User } = require("@dk3/db/lib/model/User")

jest.mock("jsonwebtoken")

const authUtils = require("..")

describe("auth-utils", () => {
  describe("register", () => {
    it("creates a user", async () => {
      const user = await authUtils.register({})

      expect(user).toBeInstanceOf(User)
    })

    describe("when saving would fail", () => {
      let origSave

      beforeEach(() => {
        User.prototype.save = jest.fn().mockReturnValue(null)
      })

      afterEach(() => {
        User.prototype.save = origSave
      })

      it("throws when creation fails", () => {
        expect(authUtils.register()).rejects.toThrow("Could not create user")
      })
    })
  })

  describe("signIn", () => {
    it("creates a jwt token when credentials match", async () => {
      jwt.sign.mockReturnValue("fake token")
      const token = await authUtils.signIn("jus@email.com", "password")

      expect(token).toEqual("fake token")
    })

    it("throws when user cant be found", async () => {
      expect(
        authUtils.signIn("not-jus@email.com", "password")
      ).rejects.toThrow()
    })

    it("throws when the users password does not match", async () => {
      expect(
        authUtils.signIn("jus@email.com", "not his password")
      ).rejects.toThrow()
    })
  })

  describe("getUserFromRequest", () => {
    let payload
    const fakeToken = "another.fake.token"
    const expiredToken = "expired.fake.token"

    beforeEach(() => {
      payload = { _id: 1234 }

      jwt.verify.mockImplementation((token, secret, callback) => {
        if (token === fakeToken) {
          callback(null, { ...payload })
        } else if (token === expiredToken) {
          callback(new jwt.TokenExpiredError("Token expired"))
        } else {
          callback(new Error("Token mismatch"))
        }
      })
    })

    it("returns user payload when valid JWT token is set and valid", async () => {
      const req = { headers: { authorization: `JWT ${fakeToken}` } }

      const userFromRequest = await authUtils.getUserFromRequest(req)

      expect(userFromRequest).toEqual(expect.objectContaining(payload))
    })

    it("throws when JWT is invalid", async () => {
      const req = { headers: { authorization: "JWT invalid.fake.token" } }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Token mismatch"
      )
    })

    it("throws when JWT has expired", async () => {
      const req = { headers: { authorization: `JWT ${expiredToken}` } }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Access token has expired"
      )
    })

    it("throws when no JWT header was set", async () => {
      const req = { headers: {} }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Not authenticated"
      )
    })

    it("throws when any other authorization header was set", async () => {
      const req = { headers: { authorization: "Bearer someBearerToken" } }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Not authenticated"
      )
    })
  })
})
