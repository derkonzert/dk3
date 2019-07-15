const config = require("@dk3/config")
const { logger } = require("@dk3/logger")
const mongoose = require("mongoose")

let isConnecting = false
let db

const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

exports.reset = () => {
  isConnecting = false
  db = null
}

exports.connect = async () => {
  try {
    if (!db && isConnecting) {
      await wait(10)
      return exports.connect()
    } else if (db) {
      return db
    }

    isConnecting = true

    const mc = await mongoose.connect(config.get("MONGODB_URI"), {
      useNewUrlParser: true,
      useFindAndModify: false,
    })

    db = mc.connection

    /* eslint-disable no-console */
    db.on("error", err => logger("db connection error:", err.message))
    db.on("open", function() {
      logger("db connection established")
    })

    return db
  } catch (err) {
    throw err
  }
}
