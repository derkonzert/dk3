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

  upcomingEvents: async (_, args, { user, dao }) => {
    if (user && args && args.filter === "mine") {
      return dao.upcomingEvents({
        filter: {
          bookmarkedBy: user._id,
        },
      })
    }
    return await dao.upcomingEvents()
  },

  pastEvents: async (_, args, context) => await context.dao.pastEvents(),
}
