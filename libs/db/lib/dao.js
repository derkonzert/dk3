const { DateTime } = require("luxon")
const User = require("./model/User")
const Event = require("./model/Event")
const SystemEvent = require("./model/SystemEvent")

/* Create cached dao method */

exports.now = Date.now

/* TODO: treat changing args as different caches */
const cachedMethods = new Map()
exports.cachedMethod = (cacheKey, method, { ttl }) => {
  if (!cachedMethods.has(cacheKey)) {
    let expiresAt = exports.now() + ttl
    let cachedResult

    cachedMethods.set(cacheKey, async (...args) => {
      if (exports.now() < expiresAt && cachedResult) {
        return cachedResult
      }

      expiresAt = exports.now() + ttl

      cachedResult = await method(...args)

      return cachedResult
    })
  }

  return cachedMethods.get(cacheKey)
}

/* User methods */
exports.createUser = async data => {
  try {
    const passwordHash = User.Model.createPasswordHash(data.password)
    const user = await User.Model.create({ ...data, passwordHash })

    return user
  } catch (err) {
    throw err
  }
}

exports.userById = async _id => await User.Model.findById(_id).exec()

exports.userByEmail = async email => await User.Model.findOne({ email }).exec()

exports.userByVerificationToken = async emailVerificationToken =>
  await User.Model.findOne({
    emailVerificationToken,
  }).exec()

exports.allUsersCount = async () =>
  await User.Model.estimatedDocumentCount().exec()

exports.updateUser = async ({ id, ...userData }) => {
  const whiteListedUserData = ["username"].reduce(
    (filteredUserData, allowedKey) => {
      if (userData[allowedKey]) {
        filteredUserData[allowedKey] = userData[allowedKey]
      }
      return filteredUserData
    },
    {}
  )

  try {
    await User.Model.findOneAndUpdate(
      { _id: id },
      { ...whiteListedUserData }
    ).exec()

    return await exports.userById(id)
  } catch (err) {
    throw err
  }
}

/* Event methods */
exports.createEvent = async (
  { eventData, autoBookmark, noSystemEvent },
  user
) => {
  if (user && autoBookmark) {
    eventData.bookmarkedBy = [user._id]
  }

  const event = await Event.Model.create({
    author: user && user._id,
    ...eventData,
  })

  if (!noSystemEvent) {
    exports.emitSystemEvent(SystemEvent.Types.eventAdded, {
      emittedBy: user ? user._id : null,
      relatedEvent: event._id,
    })
  }

  return event
}

exports.bookmarkEvent = async ({ eventId, bookmarked, userId }) => {
  try {
    const operation = bookmarked ? "$push" : "$pull"

    await Event.Model.findByIdAndUpdate(eventId, {
      [operation]: {
        bookmarkedBy: userId,
      },
    }).exec()

    return await Event.Model.findById(eventId).exec()
  } catch (err) {
    throw err
  }
}

exports.approveEvent = async ({ eventId, approved }) => {
  try {
    await Event.Model.findByIdAndUpdate(eventId, {
      approved,
    }).exec()

    return await Event.Model.findById(eventId).exec()
  } catch (err) {
    throw err
  }
}

exports.eventById = async _id => await Event.Model.findById(_id).exec()

exports.allEvents = async ({ filter = {}, sort = {} } = {}) =>
  await Event.Model.find({
    ...filter,
  })
    .sort({ from: 1, ...sort })
    .exec()

exports.allEventsCount = async () =>
  await Event.Model.estimatedDocumentCount().exec()

exports.pastEvents = async ({ filter = {}, sort = {} } = {}) =>
  await Event.Model.find({
    to: {
      $lt: DateTime.local()
        .startOf("day")
        .toJSDate(),
    },
    ...filter,
  })
    .sort({ from: -1, ...sort })
    .exec()

exports.upcomingEvents = async ({ filter = {}, sort = {} } = {}) => {
  return await Event.Model.find({
    to: {
      $gte: DateTime.local()
        .startOf("day")
        .toJSDate(),
    },
    ...filter,
  })
    .sort({ from: 1, ...sort })
    .exec()
}

/* System Events */
exports.emitSystemEvent = async (type, { emittedBy, relatedEvent }) => {
  const systemEvent = await SystemEvent.Model.create({
    type,
    emittedBy,
    relatedEvent,
  })

  return systemEvent
}

exports.clearSystemEvents = async systemEvents => {
  const result = await SystemEvent.Model.remove({
    _id: {
      $in: systemEvents.map(systemEvent => systemEvent._id),
    },
  }).exec()

  return result
}

exports.systemEventsByType = type => {
  return SystemEvent.Model.find({ type }).exec()
}
