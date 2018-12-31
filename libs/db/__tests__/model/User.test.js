// const mockingoose = require("mockingoose")
const bcrypt = require("bcrypt")
jest.mock("bcrypt")

const { User } = require("../../lib/model/User")

describe("User", () => {
  let user

  beforeEach(() => {
    user = new User({
      email: "jus@email.com",
      username: "ju",
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
      expect(User.createPasswordHash("my funky password")).toEqual("fake hash")
      expect(bcrypt.hashSync).toHaveBeenCalledWith("my funky password", 10)
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
})
