const ms = require("ms")
const jwt = require("jsonwebtoken")
const config = require("@dk3/config")
const db = require("@dk3/db")

jest.mock("jsonwebtoken")
jest.mock("@dk3/config")
jest.mock("@dk3/db")

config.get.mockImplementation(key => {
  if (key === "ACCESS_TOKEN_LIFE") {
    return "10 min"
  } else if (key === "ACCESS_TOKEN_SOFT_EXPIRE") {
    return "1 days"
  } else if (key === "JWT_SECRET") {
    return "secret"
  }
})

const dummyUserData = {
  _id: "14123412asf3",
  shortId: "nFj3lka2",
  username: "ju",
  email: "jus@email.com",
}

const authUtils = require("..")

describe("auth-utils", () => {
  describe("signUp", () => {
    const userData = { username: "ju", password: "ladida" }

    it("creates a user", async () => {
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, "my-token")
      })

      db.dao.createUser.mockResolvedValue({
        ...userData,
        save: jest.fn(),
        createDoubleOptInToken: jest.fn(),
        passwordHash: "somehash",
      })

      try {
        const result = await authUtils.signUp(userData)

        expect(result).toBe(true)
      } catch (err) {
        throw err
      }
    })

    it("throws when user creation fails", () => {
      db.dao.createUser.mockImplementation(() => {
        throw new Error("Something went wrong")
      })

      expect(authUtils.signUp()).rejects.toThrow("Something went wrong")
    })
  })

  describe("signIn", () => {
    beforeEach(() => {
      jwt.sign.mockImplementation((payload, secret, options, callback) => {
        callback(null, "fake token")
      })
    })

    afterEach(() => {
      jwt.sign.mockReset()
    })

    it("creates a jwt token, lastLogin and expiresAt", async () => {
      const lastLogin = new Date()
      const saveMock = jest.fn()

      db.dao.userByEmail.mockResolvedValue({
        username: "ju",
        email: "jus@email.com",
        lastLogin,
        comparePassword: pw => pw === "password",
        hasSkill: () => true,
        save: saveMock,
      })

      const result = await authUtils.signIn("jus@email.com", "password")

      expect(db.dao.userByEmail).toBeCalledWith("jus@email.com")

      expect(result.accessToken).toEqual("fake token")
      expect(result.lastLogin).toEqual(lastLogin)
      expect(result.expiresAt).toEqual(expect.any(Number))

      expect(saveMock).toHaveBeenCalledTimes(1)
    })

    it("throws when user cant be found", async () => {
      db.dao.userByEmail.mockResolvedValue(null)

      return expect(
        authUtils.signIn("not-jus@email.com", "password")
      ).rejects.toThrow()
    })

    it("throws when the users password does not match", async () => {
      db.dao.userByEmail.mockResolvedValue({
        username: "ju",
        email: "jus@email.com",
        comparePassword: pw => pw === "password",
        hasSkill: () => true,
      })

      return expect(
        authUtils.signIn("jus@email.com", "not his password")
      ).rejects.toThrow()
    })

    it("throws when the user does not have the login skill", async () => {
      const hasSkill = jest.fn().mockReturnValue(false)

      db.dao.userByEmail.mockResolvedValue({
        username: "ju",
        email: "jus@email.com",
        comparePassword: pw => pw === "password",
        hasSkill,
      })

      expect.assertions(2)

      try {
        await authUtils.signIn("jus@email.com", "password")
      } catch (err) {
        expect(err).toBeTruthy()
      }

      expect(hasSkill).toHaveBeenCalledWith("LOGIN")
    })
  })

  describe("generateTokens", () => {
    const jwtSigningError = new Error("jwt.sign just failed")

    beforeEach(() => {
      jwt.sign.mockImplementation((data, secret, options, callback) => {
        if (!data._id) {
          callback(jwtSigningError)
        } else if (
          data._id === dummyUserData._id &&
          data.shortId === dummyUserData.shortId &&
          options.expiresIn === "10 min" &&
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
      try {
        const result = await authUtils.generateTokens(dummyUserData)

        expect(result.accessToken).toEqual("someaccesstoken")
        expect(result.expiresAt).toEqual(expect.any(Number))
        expect(result.expiresAt).toBeGreaterThan(Date.now())
        expect(result.expiresAt).toBeLessThanOrEqual(Date.now() + ms("10 mins"))
      } catch (err) {
        throw err
      }
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
