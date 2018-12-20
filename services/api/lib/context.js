const { getUserFromRequest } = require("@dk3/auth-utils")

exports.context = async ({ req }) => {
  const user = await getUserFromRequest(req)

  return { user }
}
