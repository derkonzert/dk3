const { connect } = require("@dk3/db")
const User = require("@dk3/db/lib/model/User")
const Event = require("@dk3/db/lib/model/Event")
const { sendJson } = require("@dk3/api-utils")
const ical = require("ical-generator")
const { DateTime } = require("luxon")

const { logger, error } = require("@dk3/logger")

let isConnected = false

module.exports = async (req, res) => {
  const {
    query: { token },
  } = req

  if (!token) {
    return sendJson(res, 401, { message: "Unauthorized: No token", token })
  }

  if (!isConnected) {
    await connect()
    // eslint-disable-next-line
    isConnected = true
  }

  try {
    const user = await User.Model.findOne({
      calendarToken: token,
    }).exec()

    if (!user) {
      logger("Unauthorized ics calendar requested")
      return sendJson(res, 401, {
        message: "Unauthorized: Token invalid",
        token,
      })
    }

    var cal = ical({
      domain: "derkonzert.de",
      prodId: { company: "derkonzert.de", product: "derkonzert" },
      name: "derkonzert calendar",
      timezone: "Europe/Berlin",
      ttl: 60 * 60 * 12,
    })

    const events = await Event.Model.find({
      bookmarkedBy: {
        $in: [user._id],
      },
    })
      .sort({ from: 1 })
      .exec()

    const createSummary = event => {
      if (event.canceled) {
        return `Canceled: ${event.title}`
      }

      if (event.postponed) {
        return `Postponed: ${event.title}`
      }

      return `${event.title} @${event.location}`
    }

    for (let event of events) {
      const summary = createSummary(event)

      cal.createEvent({
        start: event.from,
        end: event.to,
        timestamp: DateTime.local().toISO(),
        uid: event.shortId,
        summary: summary,
        description: event.description,
      })
    }

    cal.serve(res)
  } catch (err) {
    await error(err)
    sendJson(res, 500, { error: err.message })
  }
}
