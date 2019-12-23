exports.Event = {
  id: event => {
    return event.shortId
  },
  fancyness: async (event, args, { dao }) => {
    // TODO: Only include "active" users, whatever that means..
    const userCount = await dao.cachedMethod(
      "fancyness.usercount",
      dao.allUsersCount,
      { ttl: 1000 * 60 * 60 }
    )()

    const likedBy = event.bookmarkedBy.length
    const likedByPercentage = likedBy / userCount

    if (likedByPercentage >= 0.1) {
      return 2
    }
    if (likedByPercentage >= 0.05) {
      return 1
    }

    return 0
  },

  author: async (event, args, { dao }) => {
    if (!event.author) {
      return null
    }

    return await dao.userById(event.author)
  },

  bookmarkedByMe: async (event, args, { user }) => {
    if (!user) {
      return false
    }

    return event.bookmarkedBy.indexOf(user._id) >= 0
  },

  bookmarkedBy: async (event, _args, { dao }) => {
    if (event.bookmarkedBy.length) {
      return await dao.usersByIds(event.bookmarkedBy)
    }

    return []
  },

  recentlyAdded: event => {
    const towDaysInMilliseconds = 1000 * 60 * 60 * 24 * 2

    return Date.now() - towDaysInMilliseconds < event.created
  },
}
