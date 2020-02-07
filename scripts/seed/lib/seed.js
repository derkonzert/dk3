const { logger } = require("@dk3/logger")
const { dao, connect } = require("@dk3/db")

const { DateTime } = require("luxon")

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const generateEventData = () => {
  const { events, description } = require("./eventsData")

  const referenceNow = events[Math.round(events.length / 2)].from

  const now = DateTime.local()
  const dateOffset = now.diff(DateTime.fromJSDate(new Date(referenceNow)))

  const yesterday = now.minus({ days: 1 })
  const lastWeek = now.minus({ days: 7 })

  return events.map((event, index) => ({
    ...event,
    title: `Mock ${event.title}`,
    description,
    created: index % 10 === 0 ? yesterday.toISO() : lastWeek.toISO(),
    from: DateTime.fromJSDate(new Date(event.from))
      .plus(dateOffset)
      .set({ minute: 0, hour: 20, second: 0, millisecond: 0 })
      .toISO(),
  }))
}

const generateUserData = () => {
  const users = require("./userData")

  return users
}

const dropCollection = async (connection, collectionName) => {
  try {
    await connection.dropCollection(collectionName)
  } catch (err) {
    logger(err.message)
  }
}

const dropDataBase = async connection => {
  await dropCollection(connection, "users")
  await dropCollection(connection, "events")
}

const seedUsers = async () => {
  const userData = generateUserData()
  const savedData = []

  while (userData.length) {
    const data = userData.shift()

    const user = await dao.createUser(data)
    savedData.push(user)
  }

  return savedData
}

const seedEvents = async users => {
  const savedData = []
  const concertData = generateEventData()

  while (concertData.length) {
    const data = concertData.shift()
    const author = users[concertData.length % 4]

    if (author) {
      data.author = author._id
    }

    data.approved = concertData.length % 10 !== 0

    const event = await dao.createEvent(
      { eventData: data, emitEvent: false },
      {}
    )

    savedData.push(event)
  }

  return savedData
}

const bookmarkEvents = async (events, users) => {
  const firstUpcomingEventsIndex = Math.round(events.length / 2)

  for (let user of users) {
    for (let event of events) {
      if (event.bookmarkedBy.indexOf(user._id) === -1) {
        if (
          events.indexOf(event) === firstUpcomingEventsIndex ||
          events.indexOf(event) % (8 + users.indexOf(user)) === 0
        ) {
          event.bookmarkedBy.push(user._id)
        }
      }
    }
  }

  for (let event of events) {
    await event.save()
  }
}

module.exports = async function seed() {
  const connection = await connect()

  logger("Dropping Database")
  await dropDataBase(connection)

  logger("Creating users")
  const users = await seedUsers()

  logger("Creating events")
  const events = await seedEvents(users)

  logger("Bookmarking events")
  await bookmarkEvents(events, users)

  logger("Waiting 3 seconds for after math")
  // Safetybelt, before closing the connection
  // (notifications e.g. might still be in creation)
  await wait(3000)

  logger("Closing connection")
  connection.close()

  logger("All good")
}
