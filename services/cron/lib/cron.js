const { connect, cron } = require("@dk3/db")

const { sendJson } = require("@dk3/api-utils")
const queryMissingMessage = "query is missing"

let cronJobsSetUp = false

module.exports = async (_req, res) => {
  /* Establish database connection */
  const { close: closeConnection } = await connect()

  /* Initially set up cron jobs */
  if (!cronJobsSetUp) {
    await cron.setup()
    cronJobsSetUp = true
  }

  try {
    const [results, errors] = await cron.runAll()

    sendJson(res, 200, {
      status: "ok",
      results: results,
      failedJobs: errors.length,
    })
  } catch (err) {
    sendJson(res, 500, { error: err.message })
  }

  await closeConnection()
}

module.exports.queryMissingMessage = queryMissingMessage
