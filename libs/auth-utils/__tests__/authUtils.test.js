const jwt = require("jsonwebtoken")
const { User, dummyUserData } = require("@dk3/db/lib/model/User")
const config = require("@dk3/config")

jest.mock("jsonwebtoken")
jest.mock("@dk3/config")

config.get.mockImplementation(key => {
  if (key === "ACCESS_TOKEN_LIFE") {
    return 2
  } else if (key === "ACCESS_TOKEN_SOFT_EXPIRE") {
    return "1 days"
  } else if (key === "JWT_SECRET") {
    return "secret"
  }
})

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
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, "fake token")
      })
      const token = await authUtils.signIn("jus@email.com", "password")

      expect(token).toEqual({
        accessToken: "fake token",
      })
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

  describe("generateTokens", () => {
    const jwtSigningError = new Error("jwt.sign just failed")
    beforeEach(() => {
      jwt.sign.mockImplementation((data, secret, options, callback) => {
        if (!data._id) {
          callback(jwtSigningError)
        } else if (
          data._id == dummyUserData._id &&
          data.email === dummyUserData.email &&
          data.username === dummyUserData.username &&
          options.expiresIn === 2 &&
          secret === "secret"
        ) {
          callback(null, "someaccesstoken")
        } else {
          callback(new Error("Some arguments dont match"))
        }
      })
    })

    it("throws when jwt.sign fails", async () => {
      expect(authUtils.generateTokens({})).rejects.toEqual(jwtSigningError)
    })

    it("generates a jwt access token", async () => {
      expect(authUtils.generateTokens(dummyUserData)).resolves.toEqual(
        expect.objectContaining({
          accessToken: "someaccesstoken",
        })
      )
    })

    it("sets softExpIn on payload", async () => {
      const now = Date.now()

      jwt.sign = jest.fn().mockImplementation((la, di, da, callback) => {
        callback(null, "sometoken")
      })

      await authUtils.generateTokens(dummyUserData)

      expect(jwt.sign.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          softExpIn: Math.floor((now + 86400000) / 1000),
        })
      )
    })
  })

  describe("getUserFromRequest", () => {
    let payload
    const fakeToken = "another.fake.token"
    const expiredToken = "expired.fake.token"

    beforeEach(() => {
      payload = { _id: 1234 }

      jwt.verify.mockImplementation((token, secret, options, callback) => {
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
      const req = { headers: { authorization: `Bearer ${fakeToken}` } }

      const userFromRequest = await authUtils.getUserFromRequest(req)

      expect(userFromRequest).toEqual(expect.objectContaining(payload))
    })

    describe("sets softExpired", () => {
      it("to false, if softExpIn is in future", async () => {
        const req = { headers: { authorization: `Bearer ${fakeToken}` } }

        payload.softExpIn = Math.floor(Date.now() / 1000) + 500

        const userFromRequest = await authUtils.getUserFromRequest(req)

        expect(userFromRequest.softExpired).toEqual(false)
      })

      it("to true, if softExpIn is not set", async () => {
        const req = { headers: { authorization: `Bearer ${fakeToken}` } }

        payload.softExpIn = undefined

        const userFromRequest = await authUtils.getUserFromRequest(req)

        expect(userFromRequest.softExpired).toEqual(true)
      })

      it("to true, if softExpIn is in the past", async () => {
        const req = { headers: { authorization: `Bearer ${fakeToken}` } }

        payload.softExpIn = Math.floor(Date.now() / 1000) - 500

        const userFromRequest = await authUtils.getUserFromRequest(req)

        expect(userFromRequest.softExpired).toEqual(true)
      })
    })

    it("throws when JWT is invalid", async () => {
      const req = { headers: { authorization: "Bearer invalid.fake.token" } }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Token mismatch"
      )
    })

    it("throws when JWT has expired", async () => {
      const req = { headers: { authorization: `Bearer ${expiredToken}` } }

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
      const req = { headers: { authorization: "NotBearer someBearerToken" } }

      expect(authUtils.getUserFromRequest(req)).rejects.toThrowError(
        "Not authenticated"
      )
    })
  })
})
