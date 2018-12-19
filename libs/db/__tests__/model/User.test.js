const { User } = require("../../lib/model/User");

describe("User", () => {
  it("implements dummy model", () => {
    const dummyUser = new User();

    expect(User.findOne({ email: dummyUser.email })).toEqual(
      expect.objectContaining(dummyUser)
    );

    expect(User.findOne({ email: "Notmyaddress" })).toEqual(null);

    expect(dummyUser.comparePassword("password")).toBeTruthy();
    expect(dummyUser.comparePassword("not the password")).toBeFalsy();
  });
});
