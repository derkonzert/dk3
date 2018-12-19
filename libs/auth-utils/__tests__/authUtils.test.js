const jwt = require("jsonwebtoken");
const { User, dummyUserData } = require("@dk3/db/lib/model/User");

jest.mock("jsonwebtoken");

const user = new User();
const authUtils = require("..");

const fakeToken = "another.fake.token";
jwt.verify.mockImplementation((token, secret, callback) => {
  if (token === "another.fake.token") {
    callback(null, user);
  } else {
    callback(new Error("Token mismatch"));
  }
});

describe("auth-utils", () => {
  describe("register", () => {
    it("creates a user", async () => {
      const user = await authUtils.register({});

      expect(user).toBeInstanceOf(User);
    });

    describe("when saving would fail", () => {
      let origSave;

      beforeEach(() => {
        User.prototype.save = jest.fn().mockReturnValue(null);
      });

      afterEach(() => {
        User.prototype.save = origSave;
      });

      it("throws when creation fails", () => {
        expect(authUtils.register()).rejects.toThrow("Could not create user");
      });
    });
  });

  describe("signIn", () => {
    it("creates a jwt token when credentials match", async () => {
      jwt.sign.mockReturnValue("fake token");
      const token = await authUtils.signIn("jus@email.com", "password");

      expect(token).toEqual("fake token");
    });

    it("throws when user cant be found", async () => {
      expect(
        authUtils.signIn("not-jus@email.com", "password")
      ).rejects.toThrow();
    });

    it("throws when the users password does not match", async () => {
      expect(
        authUtils.signIn("jus@email.com", "not his password")
      ).rejects.toThrow();
    });
  });

  describe("authenticatedRequest", () => {
    it("sets req.user when valid JWT token is set", async () => {
      const req = { headers: { authorization: `JWT ${fakeToken}` } };
      const res = {};

      const handler = jest.fn();

      await authUtils.authenticatedRequest(handler)(req, res);

      expect(handler).toBeCalledWith(
        expect.objectContaining({ user: user, headers: req.headers }),
        res
      );
    });

    it("doesnt set req.user when invalid JWT token is set", async () => {
      const req = { headers: { authorization: "JWT invalid.fake.token" } };
      const res = {};

      const handler = jest.fn();

      await authUtils.authenticatedRequest(handler)(req, res);

      expect(handler).toBeCalledWith(
        expect.not.objectContaining({ user: user }),
        res
      );
    });

    it("doesnt set req.user when no JWT token is set", async () => {
      const req = { headers: {} };
      const res = {};

      const handler = jest.fn();

      await authUtils.authenticatedRequest(handler)(req, res);

      expect(handler).toBeCalledWith(
        expect.not.objectContaining({ user: user }),
        res
      );
    });
  });
});
