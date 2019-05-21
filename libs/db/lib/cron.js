const { logger } = require("@dk3/logger")

const cronJobs = require("./cronJobs")
const CronJob = require("./model/CronJob")

exports.createJob = async ({ forceUpdate, ...options }) => {
  let newlySaved = false

  try {
    const newJob = new CronJob.Model(options)

    await newJob.save()
    newlySaved = true
  } catch (err) {
    /* silently fail */
  }

  if (!newlySaved && forceUpdate) {
    try {
      await CronJob.Model.findOneAndUpdate({ name: options.name }, options)
    } catch (err) {
      throw err
    }
  }
}

const eventNotificationsLastExecuted = new Date()
if (eventNotificationsLastExecuted.getUTCHours() > 16) {
  eventNotificationsLastExecuted.setUTCHours(16, 0, 0, 0)
} else {
  eventNotificationsLastExecuted.setUTCHours(4, 0, 0, 0)
}

exports.cronJobConfigurations = [
  { name: "doubleOptIn", interval: "2m", initialRun: true },
  { name: "passwordReset", interval: "2m", initialRun: true },
  { name: "autoResendDoubleOptIn", interval: "24h", initialRun: true },
  {
    name: "eventNotifications",
    interval: "12h",
    lastExecuted: eventNotificationsLastExecuted,
    initialRun: false,
    forceUpdate: true,
  },
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
    try {
      // Try to unblock the job at least
      cronJob.running = false
      await cronJob.save()
    } catch (err) {
      throw err
    }
    throw err
  }
}
