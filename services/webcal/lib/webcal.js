const url = require("url")
const { connect } = require("@dk3/db")
const User = require("@dk3/db/lib/model/User")
const Event = require("@dk3/db/lib/model/Event")
const { sendJson } = require("@dk3/api-utils")
const ical = require("ical-generator")
const { DateTime } = require("luxon")

let dbConnection

module.exports = async (req, res) => {
  const {
    query: { token },
  } = url.parse(req.url, true)

  if (!token) {
    return sendJson(res, 401, { message: "Unauthorized: No token" })
  }

  if (!dbConnection) {
    dbConnection = await connect()
  }

  try {
    const user = await User.Model.findOne({
      calendarToken: token,
    }).exec()

    if (!user) {
      return sendJson(res, 401, { message: "Unauthorized: Token invalid" })
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

    for (let event of events) {
      const summary = event.canceled
        ? `Canceled: ${event.title}`
        : `${event.title} @${event.location}`

      cal.createEvent({
        start: event.from,
        end: event.to,
        timestamp: DateTime.local().toLocaleString(),
        uid: event.shortId,
        summary: summary,
        description: event.description,
      })
    }

    cal.serve(res)
  } catch (err) {
    sendJson(res, 500, { error: err.message })
  }
}
