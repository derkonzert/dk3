const { error, logger } = require("@dk3/logger")
const { connect, resetConnect, cron } = require("@dk3/db")

const { sendJson } = require("@dk3/api-utils")
const queryMissingMessage = "query is missing"

let cronJobsSetUp = false

module.exports = async (_req, res) => {
  let connection

  try {
    logger("connecting")
    /* Establish database connection */
    connection = await connect()
  } catch (err) {
    error(err)

    sendJson(res, 500, { error: "No connection possible" })
    return
  }

  /* Initially set up cron jobs */
  if (!cronJobsSetUp) {
    logger("setup")
    try {
      await cron.setup()
      // eslint-disable-next-line require-atomic-updates
      cronJobsSetUp = true
    } catch (err) {
      error(err)
    }
  }

  try {
    logger("runAll")
    const [results, errors] = await cron.runAll()

    logger("close conenction")
    await connection.close()
    resetConnect()

    sendJson(res, 200, {
      status: "ok",
      results: results,
      failedJobs: errors.length,
    })
  } catch (err) {
    error(err)
    sendJson(res, 500, { error: err.message })

    await connection.close()
    resetConnect()
  }
}

module.exports.queryMissingMessage = queryMissingMessage
