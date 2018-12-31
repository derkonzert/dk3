const { DateTime } = require("luxon")
const User = require("./model/User")
const Event = require("./model/Event")

/* User methods */
exports.createUser = async data => {
  try {
    const passwordHash = User.Model.createPasswordHash(data.password)

    return await User.Model.create({ ...data, passwordHash })
  } catch (err) {
    throw err
  }
}

exports.userById = async _id => await User.Model.findById(_id).exec()

exports.userByEmail = async email => await User.Model.findOne({ email }).exec()

/* Event methods */
exports.createEvent = async ({ eventData, autoLike }, user) => {
  if (user && autoLike) {
    eventData.likedBy = [user._id]
  }

  return await Event.Model.create({ author: user && user._id, ...eventData })
}

exports.likeEvent = async (eventId, like, userId) => {
  try {
    const operation = like ? "$push" : "$pull"

    await Event.Model.findByIdAndUpdate(eventId, {
      [operation]: {
        likedBy: userId,
      },
    }).exec()

    return await Event.Model.findById(eventId).exec()
  } catch (err) {
    throw err
  }
}

exports.allEvents = async ({ filter = {}, sort = {} } = {}) =>
  await Event.Model.find({
    ...filter,
  })
    .sort({ from: 1, ...sort })
    .exec()

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

exports.upcomingEvents = async ({ filter = {}, sort = {} } = {}) =>
  await Event.Model.find({
    to: {
      $gte: DateTime.local()
        .startOf("day")
        .toJSDate(),
    },
    ...filter,
  })
    .sort({ from: 1, ...sort })
    .exec()
