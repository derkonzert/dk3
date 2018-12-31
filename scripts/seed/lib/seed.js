const { logger } = require("@dk3/logger")
const { dao, connect } = require("@dk3/db")

const { DateTime } = require("luxon")

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const generateConcertData = () => {
  const events = require("./eventsData")

  const referenceNow = events[Math.round(events.length / 2)].from

  const now = DateTime.local()
  const dateOffset = now.diff(DateTime.fromJSDate(new Date(referenceNow)))

  return events.map(event => ({
    ...event,
    title: `Mock ${event.title}`,
    from: DateTime.fromJSDate(new Date(event.from))
      .plus(dateOffset)
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
  try {
    await dropCollection(connection, "users")
  } catch (err) {
    throw err
  }
}

const seedUsers = async () => {
  const userData = generateUserData()
  const savedData = []

  while (userData.length) {
    const data = userData.shift()

    try {
      const user = await dao.createUser(data)
      savedData.push(user)
    } catch (err) {
      throw err
    }
  }

  return savedData
}

const seedConcerts = async users => {
  const concertData = generateConcertData()

  while (concertData.length) {
    const data = concertData.shift()
    const author = users[concertData.length % 3]

    if (author) {
      data.author = author._id
    }

    try {
      await dao.createEvent({ eventData: data }, {})
    } catch (err) {
      throw err
    }
  }
}

const seed = async () => {
  const connection = await connect()

  try {
    logger("Dropping Database")
    await dropDataBase(connection)

    logger("Creating users")
    const users = await seedUsers()

    logger("Creating events")
    await seedConcerts(users)

    logger("Waiting 5 seconds for after math")
    // Safetybelt, before closing the connection
    // (notifications e.g. might still be in creation)
    await wait(5000)
  } catch (err) {
    throw err
  }

  logger("Closing connection")
  connection.close()

  logger("All good")
}

seed()
