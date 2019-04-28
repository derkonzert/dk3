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

exports.updateUserPassword = async ({ userId, password }) => {
  try {
    const passwordHash = User.Model.createPasswordHash(password)

    await User.Model.findByIdAndUpdate(userId, { passwordHash }).exec()
  } catch (err) {
    throw err
  }
}

exports.userById = async _id => await User.Model.findById(_id).exec()
exports.usersByIds = async ids =>
  await User.Model.find({ _id: { $in: ids } }).exec()
exports.userByShortId = async shortId =>
  await User.Model.findOne({ shortId }).exec()

exports.usersWithSendEmail = async () =>
  await User.Model.find({ sendEmails: true })

exports.userByEmail = async email => await User.Model.findOne({ email }).exec()

exports.userByVerificationToken = async emailVerificationToken =>
  await User.Model.findOne({
    emailVerificationToken,
  }).exec()

exports.userByPasswordResetToken = async passwordResetToken =>
  await User.Model.findOne({ passwordResetToken }).exec()

exports.allUsersCount = async () =>
  await User.Model.estimatedDocumentCount().exec()

exports.updateUser = async ({ shortId, ...userData }) => {
  const whiteListedUserData = [
    "username",
    "sendEmails",
    "autoBookmark",
    "publicUsername",
  ].reduce((filteredUserData, allowedKey) => {
    if (allowedKey in userData) {
      filteredUserData[allowedKey] = userData[allowedKey]
    }
    return filteredUserData
  }, {})

  try {
    await User.Model.findOneAndUpdate(
      { shortId },
      { ...whiteListedUserData }
    ).exec()

    return await exports.userByShortId(shortId)
  } catch (err) {
    throw err
  }
}

/* Event methods */
exports.createEvent = async (
  { eventData, autoBookmark, emitEvent = true },
  user
) => {
  if (user && autoBookmark) {
    eventData.bookmarkedBy = [user._id]
  }

  const event = await Event.Model.create({
    author: user && user._id,
    ...eventData,
  })

  if (emitEvent) {
    exports.emitSystemEvent(SystemEvent.Types.eventAdded, {
      emittedBy: user ? user._id : null,
      relatedEvent: event._id,
    })
  }

  return event
}

exports.updateEvent = async ({ shortId, ...eventData }) => {
  try {
    await Event.Model.findOneAndUpdate({ shortId }, { ...eventData }).exec()

    return await exports.eventByShortId(shortId)
  } catch (err) {
    throw err
  }
}

exports.deleteEvent = async ({ shortId }) => {
  try {
    const result = await Event.Model.findOneAndDelete({ shortId }).exec()

    return result
  } catch (err) {
    throw err
  }
}

exports.bookmarkEvent = async ({ eventShortId, bookmarked, userId }) => {
  try {
    const operation = bookmarked ? "$push" : "$pull"

    await Event.Model.findOneAndUpdate(
      { shortId: eventShortId },
      {
        [operation]: {
          bookmarkedBy: userId,
        },
      }
    ).exec()

    return await Event.Model.findOne({ shortId: eventShortId }).exec()
  } catch (err) {
    throw err
  }
}

exports.approveEvent = async ({ eventShortId, approved }) => {
  try {
    await Event.Model.findOneAndUpdate(
      { shortId: eventShortId },
      {
        approved,
      }
    ).exec()

    return await Event.Model.findOne({ shortId: eventShortId }).exec()
  } catch (err) {
    throw err
  }
}

exports.eventById = async _id => await Event.Model.findById(_id).exec()
exports.eventsByIds = async ids =>
  await Event.Model.find({ _id: { $in: ids } })
    .sort({
      from: 1,
    })
    .exec()
exports.eventByShortId = async shortId =>
  await Event.Model.findOne({ shortId }).exec()

function escapeRegexCharacters(string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")
}

function suggest(query, fieldKey) {
  return new Promise((resolve, reject) => {
    Event.Model.aggregate(
      [
        { $unwind: fieldKey },
        {
          $group: {
            _id: fieldKey,
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
      ],
      (err, results) => {
        if (err) {
          return reject(err)
        }

        const filterRegExp = new RegExp(escapeRegexCharacters(query), "i")

        resolve(
          results
            .map(result => result._id)
            .filter(item => item.match(filterRegExp) !== null)
        )
      }
    )
  })
}
exports.locationsSearch = async search => {
  return await suggest(search, "$location")
}

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
  const result = await SystemEvent.Model.deleteMany({
    _id: {
      $in: systemEvents.map(systemEvent => systemEvent._id),
    },
  }).exec()

  return result
}

exports.systemEventsByType = type => {
  return SystemEvent.Model.find({ type }).exec()
}
