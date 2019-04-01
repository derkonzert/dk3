// const dao = require("./dao")
const { logger } = require("@dk3/logger")

exports.doubleOptIn = async () => {
  logger("Sending out double opt in emails")

  return "Sent 0 doi mails"
}

exports.eventNotifications = async () => {
  logger("---------- sending event notifications")
  return "Sent 0 event notificaitons"
}
