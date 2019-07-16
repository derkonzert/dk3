const { DateTime, Duration } = require("luxon")
const { sendDoubleOptInMail } = require("@dk3/mailer")
const { sendPasswordResetMail } = require("@dk3/mailer")
const { sendEventNotificationEmail } = require("@dk3/mailer")

const SystemEvent = require("./model/SystemEvent")
const dao = require("./dao")

exports.doubleOptIn = async () => {
  const systemEvents = await dao.systemEventsByType(
    SystemEvent.Types.doiRequested
  )

  for (let systemEvent of systemEvents) {
    const user = await dao.userById(systemEvent.emittedBy)

    await sendDoubleOptInMail(user)
  }

  if (systemEvents.length) {
    await dao.clearSystemEvents(systemEvents)
  }

  return `Sent ${systemEvents.length} doi mails`
}

exports.autoResendDoubleOptIn = async () => {
  const usersWithVerificationToken = await dao.usersWithVerificationToken({
    filter: {
      created: {
        $lt: DateTime.local()
          .minus(Duration.fromObject({ days: 2 }))
          .toJSDate(),
      },
    },
  })

  for (let user of usersWithVerificationToken) {
    await user.createDoubleOptInToken()

    await sendDoubleOptInMail(user)
  }

  return `Resent ${usersWithVerificationToken.length} auto doi mails`
}

exports.passwordReset = async () => {
  const systemEvents = await dao.systemEventsByType(
    SystemEvent.Types.passwordResetRequested
  )

  for (let systemEvent of systemEvents) {
    const user = await dao.userById(systemEvent.emittedBy)

    await sendPasswordResetMail(user)
  }

  if (systemEvents.length) {
    await dao.clearSystemEvents(systemEvents)
  }

  return `Sent ${systemEvents.length} password reset mails`
}

exports.eventNotifications = async () => {
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

  /* Don't send emails for events that are already over */
  const addedEventsWithoutArchived = addedEvents.filter(event => {
    return DateTime.fromJSDate(event.to).diffNow() > 0
  })

  if (!addedEventsWithoutArchived.length) {
    return sentMessage()
  }

  const users = await dao.usersWithSendEmail()

  for (let user of users) {
    await sendEventNotificationEmail(user, {
      addedEvents: addedEventsWithoutArchived,
    })
    sentNotifications += 1
  }

  await dao.clearSystemEvents(systemEvents)

  return sentMessage()
}
