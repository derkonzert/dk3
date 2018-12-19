const { json } = require("micro");
const url = require("url");
const { register, signIn, authenticatedRequest } = require("@dk3/auth-utils");

module.exports = authenticatedRequest(async function auth(req, res) {
  const { query } = url.parse(req.url, true);

  try {
    switch (query.operation) {
      case "register":
        const newUser = await register();

        return res.json(newUser);

      case "signIn":
        const body = await json(req);

        try {
          const token = await signIn(body.email, body.password);

          if (!token) {
            throw new Error("Invalid Credentials");
          }

          return res.json({
            token
          });
        } catch (err) {
          throw err;
        }

      /* Example route for "secured" content */
      case "secured":
        return res.json(req.user || { anonymous: true });
      default:
        res.status(404);
        return res.json({
          message: "not found"
        });
    }
  } catch (err) {
    res.status(401);

    return res.json({
      message: err.message
    });
  }
});
