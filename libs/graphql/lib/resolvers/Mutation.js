const { generateBasicToken } = require("@dk3/auth-utils")
const userSkills = require("@dk3/db/lib/model/userSkills")

exports.Mutation = {
  createEvent: async (parent, args, { dao, user }) => {
    const { autoBookmark, ...eventData } = args.input

    return await dao.createEvent(
      { eventData, autoBookmark: !!user && !!user._id && autoBookmark },
      user
    )
  },

  bookmarkEvent: async (parent, args, { dao, user }) => {
    const { id, bookmarked } = args.input

    if (!user) {
      throw new Error("Unauthenticated request")
    }

    return await dao.bookmarkEvent({
      eventShortId: id,
      bookmarked,
      userId: user._id,
    })
  },

  approveEvent: async (parent, args, { dao, user }) => {
    const { id, approved } = args.input

    if (!user) {
      throw new Error("Unauthenticated request")
    }

    const userModel = await dao.userById(user._id)

    if (!userModel || !userModel.hasSkill("APPROVE_EVENT")) {
      throw new Error("Unauthorized request")
    }

    return await dao.approveEvent({
      eventShortId: id,
      approved,
    })
  },

  updateEvent: async (parent, args, { dao, user }) => {
    const { id, ...updateValues } = args.input

    if (!user) {
      throw new Error("Unauthenticated request")
    }

    const userModel = await dao.userById(user._id)

    if (!userModel.hasSkill(userSkills.UPDATE_EVENT)) {
      throw new Error("Unauthorized request")
    }

    const result = await dao.updateEvent({
      shortId: id,
      ...updateValues,
    })

    return result
  },

  updateSelf: async (parent, args, { dao, user }) => {
    const { id, ...updateValues } = args.input

    if (!user) {
      throw new Error("Unauthenticated request")
    }

    if (user.shortId !== id) {
      throw new Error("Unauthorized request")
    }

    const result = await dao.updateUser({
      shortId: id,
      ...updateValues,
    })

    return result
  },

  updateCalendarToken: async (parent, args, { dao, user }) => {
    const { id, enableCalendar } = args.input

    if (!user) {
      throw new Error("Unauthenticated request")
    }

    if (user.shortId !== id) {
      throw new Error("Unauthorized request")
    }

    const userModel = await dao.userById(user._id)

    if (userModel.calendarToken && enableCalendar) {
      /* There already is a token */
      return userModel
    } else if (enableCalendar) {
      userModel.calendarToken = await generateBasicToken()

      await userModel.save()

      return userModel
    } else if (userModel.calendarToken) {
      userModel.set("calendarToken", null)

      await userModel.save()
      return userModel
    }
  },
}
