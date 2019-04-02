// const dao = require("./dao")
const { logger } = require("@dk3/logger")
const { sendDoubleOptInMail } = require("@dk3/mailer")

const SystemEvent = require("./model/SystemEvent")
const dao = require("./dao")

exports.doubleOptIn = async () => {
  logger("Sending out double opt in emails")

  try {
    const systemEvents = await dao.systemEventsByType(
      SystemEvent.Types.doiRequested
    )

    for (let systemEvent of systemEvents) {
      const user = await dao.userById(systemEvent.emittedBy)

      await sendDoubleOptInMail(user)
    }

    if (systemEvents.length) {
      try {
        await dao.clearSystemEvents(systemEvents)
      } catch (err) {
        throw err
      }
    }

    return `Sent ${systemEvents.length} doi mails`
  } catch (err) {
    throw err
  }
}

exports.eventNotifications = async () => {
  logger("---------- sending event notifications")
  return "Sent 0 event notificaitons"
}
