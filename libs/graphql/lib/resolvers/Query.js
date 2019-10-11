const userSkills = require("@dk3/db/lib/model/userSkills")

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

  /* Lists */
  upcomingEvents: async (_, args = {}, { user, dao }) => {
    const { filter, skip, limit } = args

    const withSkipLimit = !(skip === undefined || limit === undefined)

    let events
    if (user && filter === "mine") {
      events = await dao.upcomingEvents({
        filter: {
          bookmarkedBy: user._id,
        },
        skip,
        limit,
      })
    } else {
      events = await dao.upcomingEvents({ skip, limit })
    }

    const totalCount = withSkipLimit
      ? await dao.cachedMethod(
          "upcomingEvents.totalCount",
          dao.allUpcomingEventsCount,
          { ttl: 1000 * 60 * 60 }
        )()
      : events.length

    const hasMore = withSkipLimit ? totalCount > skip + limit : false
    const nextPage = withSkipLimit ? skip + limit : totalCount

    return {
      events,
      nextPage,
      hasMore,
      totalCount,
    }
  },

  similarEvents: async (_, args, { user, dao }) => {
    const { title } = args

    if (!user || !user._id) {
      throw new Error("Unauthenticated request")
    }

    const userModel = await dao.userById(user._id)

    if (!userModel.hasSkill(userSkills.IMPORT_EVENT)) {
      throw new Error("Unauthorized request")
    }

    return await dao.findSimilarEvents({ title })
  },

  pastEvents: async (_, args, { dao }) => {
    const totalCount = await dao.cachedMethod(
      "pastEvents.totalCount",
      dao.allPastEventsCount,
      { ttl: 1000 * 60 * 60 }
    )()

    const { page } = args

    const [events, hasMore] = await Promise.all([
      dao.pastEvents({ page, perPage: 120 }),
      dao.hasMorePastEvents({ page, perPage: 120 }),
    ])

    return {
      events,
      hasMore,
      nextPage: page + 1,
      totalCount,
    }
  },

  /* Single Nodes */
  event: async (_, { id }, { dao } /*, info*/) => {
    // TODO: only get fields from DB that are requested?
    // for example with https://www.npmjs.com/package/graphql-fields
    const event = await dao.eventByShortId(id)

    if (!event) {
      throw new Error("Event not found")
    }

    return event
  },

  locations: async (_, { search }, { dao }) => {
    const locations = await dao.locationsSearch(search)

    return locations.map(name => ({ name }))
  },
}
