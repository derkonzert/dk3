const { error } = require("@dk3/logger")
const { connect, cron } = require("@dk3/db")

const { sendJson } = require("@dk3/api-utils")
const queryMissingMessage = "query is missing"

let cronJobsSetUp = false

module.exports = async (_req, res) => {
  /* Establish database connection */
  const connection = await connect()

  /* Initially set up cron jobs */
  if (!cronJobsSetUp) {
    try {
      await cron.setup()
      // eslint-disable-next-line require-atomic-updates
      cronJobsSetUp = true
    } catch (err) {
      error(err)
    }
  }

  try {
    const [results, errors] = await cron.runAll()

    await connection.close()

    sendJson(res, 200, {
      status: "ok",
      results: results,
      failedJobs: errors.length,
    })
  } catch (err) {
    error(err)
    sendJson(res, 500, { error: err.message })
  }
}

module.exports.queryMissingMessage = queryMissingMessage
