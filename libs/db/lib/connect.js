const config = require("@dk3/config")
const { logger } = require("@dk3/logger")
const mongoose = require("mongoose")

exports.connect = async () => {
  const { connection: db } = await mongoose.connect(
    config.get("MONGODB_URI"),
    { useNewUrlParser: true }
  )

  /* eslint-disable no-console */
  db.on("error", err => logger("db connection error:", err.message))
  db.on("open", function() {
    logger("db connection established")
  })

  return db
}
