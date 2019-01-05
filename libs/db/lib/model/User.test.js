const config = require("@dk3/config")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")

const userSkills = require("../../lib/model/userSkills")
const User = require("../../lib/model/User")

describe("User", () => {
  let user

  beforeEach(() => {
    user = new User.Model({
      email: "jus@email.com",
      username: "ju",
      skills: ["malenNachZahlen"],
      passwordHash: "jus password hash",
    })

    bcrypt.compareSync.mockImplementation(password => {
      if (`${password} hash` === user.passwordHash) {
        return true
      }
      return false
    })

    bcrypt.hashSync.mockReturnValue("fake hash")
  })

  describe(".hashPassword", () => {
    it("uses bcrypt to hash the given raw password", () => {
      expect(User.Model.createPasswordHash("my funky password")).toEqual(
        "fake hash"
      )
      expect(bcrypt.hashSync).toHaveBeenCalledWith(
        "my funky password",
        config.get("PASSWORD_HASH_SALT_ROUNDS")
      )
    })
  })

  describe("model.comparePassword", () => {
    it("returns false if password hashes dont match", async () => {
      expect(user.comparePassword("not jus password")).toBe(false)
    })

    it("returns true if password hashes do match", async () => {
      expect(user.comparePassword("jus password")).toBe(true)
    })
  })

  describe("model.hasSkill", () => {
    it("returns true if the user has the given skill", () => {
      expect(user.hasSkill("malenNachZahlen")).toBe(true)
    })

    it("returns false if the user doesnt have the given skill", () => {
      expect(user.hasSkill("creativity")).toBe(false)
    })

    it("always returns true if the user has special MAGIC skill", () => {
      user.skills.push(userSkills.MAGIC)

      expect(user.hasSkill("creativity")).toBe(true)
    })
  })
})
