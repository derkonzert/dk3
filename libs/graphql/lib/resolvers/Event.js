exports.Event = {
  fancyness: async (event /* args, context*/) => {
    return event.bookmarkedBy.length > 0 ? 1 : 0
  },

  bookmarkedByMe: async (event, args, { user }) => {
    if (!user) {
      return false
    }

    return event.bookmarkedBy.indexOf(user._id) >= 0
  },
}
