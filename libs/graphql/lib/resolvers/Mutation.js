exports.Mutation = {
  createEvent: async (parent, args, { dao, user }) => {
    const { ...eventData } = args.input

    return await dao.createEvent({ eventData }, user)
  },

  bookmarkEvent: async (parent, args, { dao, user }) => {
    const { id, bookmarked } = args.input

    if (!user) {
      throw new Error("Unauthorized request")
    }

    return await dao.bookmarkEvent({
      eventId: id,
      bookmarked,
      userId: user._id,
    })
  },

  approveEvent: async (parent, args, { dao, user }) => {
    const { id, approved } = args.input

    if (!user) {
      throw new Error("Unauthorized request")
    }

    const userModel = await dao.userById(user._id)

    if (!userModel || !userModel.hasSkill("APPROVE_EVENT")) {
      throw new Error("Unauthorized request")
    }

    return await dao.approveEvent({
      eventId: id,
      approved,
    })
  },

  updateSelf: async (parent, args, { dao, user }) => {
    const { id, ...updateValues } = args.input

    if (user._id !== id) {
      throw new Error("Unauthorized request")
    }

    const result = await dao.updateUser({
      id,
      ...updateValues,
    })

    return result
  },
}
