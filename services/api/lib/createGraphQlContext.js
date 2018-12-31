const { dao } = require("@dk3/db")
const { getUserFromRequest } = require("@dk3/auth-utils")

exports.createGraphQlContext = async ({ req }) => {
  const context = {
    dao,
  }

  try {
    const user = await getUserFromRequest(req)

    context.user = user
  } catch (err) {
    /* Unauthenticated request: no user available */
  }
  return context
}
