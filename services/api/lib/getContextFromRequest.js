const { getUserFromRequest } = require("@dk3/auth-utils")

exports.getContextFromRequest = async ({ req }) => {
  try {
    const user = await getUserFromRequest(req)
    return { user }
  } catch (err) {
    /* Unauthenticated request: no user available */
    return {}
  }
}
