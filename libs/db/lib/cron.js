const { logger } = require("@dk3/logger")

const cronJobs = require("./cronJobs")
const CronJob = require("./model/CronJob")

exports.createJob = async options => {
  try {
    const newJob = new CronJob.Model(options)

    await newJob.save()
  } catch (err) {
    /* silently fail */
  }
}

exports.cronJobConfigurations = [
  { name: "doubleOptIn", interval: "10s", initialRun: true },
  { name: "eventNotifications", interval: "10m", initialRun: true },
]

exports.setup = async () => {
  for (let config of exports.cronJobConfigurations) {
    await exports.createJob(config)
  }
}

exports.runAll = async () => {
  const startedAt = Date.now()
  /* Find jobs that are not currently running */
  try {
    const cronJobs = await CronJob.Model.find({ running: false })
      .sort({ lastExecuted: -1 })
      .exec()

    const results = []
    const errors = []

    for (let job of cronJobs) {
      if (job.shouldRun()) {
        try {
          const result = await exports.runJob(job)
          results.push(result)
        } catch (err) {
          errors.push(err)
          logger(`cron "${job.name}" execution failed:`, err.message)
        }

        if (Date.now() - startedAt >= 60 * 1000) {
          break
        }
      }
    }

    return [results, errors]
  } catch (err) {
    throw err
  }
}

exports.runJob = async cronJob => {
  const cronFn = cronJobs[cronJob.name]

  if (!cronFn) {
    throw new Error(`No cron function configured for cronJob "${cronJob.name}"`)
  }

  try {
    cronJob.running = true
    await cronJob.save()

    const cronResult = await cronFn()

    cronJob.running = false
    cronJob.lastExecuted = new Date()
    await cronJob.save()

    return cronResult
  } catch (err) {
    throw err
  }
}
