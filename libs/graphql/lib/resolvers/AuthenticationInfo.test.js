const { AuthenticationInfo } = require("../../lib/resolvers/AuthenticationInfo")

describe("AuthenticationInfo", () => {
  const payload = {
    exp: 1546171883,
    softExpIn: 1546166883,
  }

  describe("tokenExpiresAt", () => {
    it("retrieves token expiration date from payload", () => {
      expect(AuthenticationInfo.tokenExpiresAt(payload)).toEqual(
        "2018-12-30T12:11:23.000Z"
      )
    })

    it("throws if now exp is not set on payload", () => {
      expect(() => AuthenticationInfo.tokenExpiresAt({})).toThrow()
    })
  })

  describe("softExpiresAt", () => {
    it("retrieves token expiration date from payload", () => {
      expect(AuthenticationInfo.softExpiresAt(payload)).toEqual(
        "2018-12-30T10:48:03.000Z"
      )
    })

    it("throws if now softExpIn is not set on payload", () => {
      expect(() => AuthenticationInfo.tokenExpiresAt({})).toThrow()
    })
  })
})
