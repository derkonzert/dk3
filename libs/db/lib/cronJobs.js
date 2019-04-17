const { sendDoubleOptInMail } = require("@dk3/mailer")
const { sendPasswordResetMail } = require("@dk3/mailer")

const SystemEvent = require("./model/SystemEvent")
const dao = require("./dao")

exports.doubleOptIn = async () => {
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

exports.passwordReset = async () => {
  try {
    const systemEvents = await dao.systemEventsByType(
      SystemEvent.Types.passwordResetRequested
    )

    for (let systemEvent of systemEvents) {
      const user = await dao.userById(systemEvent.emittedBy)

      await sendPasswordResetMail(user)
    }

    if (systemEvents.length) {
      try {
        await dao.clearSystemEvents(systemEvents)
      } catch (err) {
        throw err
      }
    }

    return `Sent ${systemEvents.length} password reset mails`
  } catch (err) {
    throw err
  }
}

exports.eventNotifications = async () => {
  return "Sent 0 event notificaitons"
}
