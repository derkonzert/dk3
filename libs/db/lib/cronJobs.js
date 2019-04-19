const { sendDoubleOptInMail } = require("@dk3/mailer")
const { sendPasswordResetMail } = require("@dk3/mailer")
const { sendEventNotificationEmail } = require("@dk3/mailer")

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
  try {
    let sentNotifications = 0
    let sentMessage = () => `Sent ${sentNotifications} event notifications`

    const systemEvents = await dao.systemEventsByType(
      SystemEvent.Types.eventAdded
    )

    if (!systemEvents.length) {
      return sentMessage()
    }

    const addedEvents = await dao.eventsByIds(
      systemEvents.map(event => event.relatedEvent)
    )

    if (!addedEvents.length) {
      return sentMessage()
    }

    const users = await dao.usersWithSendEmail()

    for (let user of users) {
      await sendEventNotificationEmail(user, { addedEvents })
      sentNotifications += 1
    }

    try {
      await dao.clearSystemEvents(systemEvents)
    } catch (err) {
      throw err
    }

    return sentMessage()
  } catch (err) {
    throw err
  }
}
