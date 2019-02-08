exports.Event = {
  fancyness: async (event, args, { dao }) => {
    const userCount = await dao.cachedMethod(
      "fancyness.usercount",
      dao.allUsersCount,
      { ttl: 1000 * 60 * 60 }
    )()

    const likedByPercentage = event.bookmarkedBy.length / userCount

    if (likedByPercentage > 0.6) {
      return 2
    }
    if (likedByPercentage > 0.3) {
      return 1
    }

    return 0
  },

  bookmarkedByMe: async (event, args, { user }) => {
    if (!user) {
      return false
    }

    return event.bookmarkedBy.indexOf(user._id) >= 0
  },
}
