exports.Query = {
  me: async (_, args, context) => {
    if (context.user) {
      return await context.dao.userById(context.user._id)
    }
    return null
  },

  authInfo: (_, args, context) => {
    if (context.user) {
      return context.user
    }
    return null
  },

  upcoming: async (_, args, context) => await context.dao.upcomingEvents(),
}
