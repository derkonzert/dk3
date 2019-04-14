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

    if (likedByPercentage >= 0.2) {
      return 2
    }
    if (likedByPercentage >= 0.1) {
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

  recentlyAdded: event => {
    const towDaysInMilliseconds = 1000 * 60 * 60 * 24 * 2

    return Date.now() - towDaysInMilliseconds < event.created
  },
}
