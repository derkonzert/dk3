const { error } = require("@dk3/logger")

const cronJobs = require("./cronJobs")
const CronJob = require("./model/CronJob")

exports.createJob = async ({ forceUpdate, ...options }) => {
  let newlySaved = false

  try {
    const newJob = new CronJob.Model(options)

    await newJob.save()

    newlySaved = true
  } catch (err) {
    if (err.message.search("E11000 duplicate") >= 0) {
      /* silently fail */
    } else {
      error(err)
    }
  }

  if (!newlySaved && forceUpdate) {
    try {
      await CronJob.Model.findOneAndUpdate({ name: options.name }, options)
    } catch (err) {
      error(err)
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
  { name: "autoResendDoubleOptIn", interval: "72h", initialRun: true },
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
    try {
      await exports.createJob(config)
    } catch (err) {
      error(err)
    }
  }
}

exports.runAll = async () => {
  const startedAt = Date.now()
  /* Find jobs that are not currently running */

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

        error(err)
      }

      if (Date.now() - startedAt >= 60 * 1000) {
        break
      }
    }
  }

  return [results, errors]
}

exports.runJob = async cronJob => {
  const cronFn = cronJobs[cronJob.name]

  if (!cronFn) {
    throw new Error(`No cron function configured for cronJob "${cronJob.name}"`)
  }

  try {
    // eslint-disable-next-line require-atomic-updates
    cronJob.running = true
    await cronJob.save()

    const cronResult = await cronFn()

    // eslint-disable-next-line require-atomic-updates
    cronJob.running = false
    // eslint-disable-next-line require-atomic-updates
    cronJob.lastExecuted = new Date()

    await cronJob.save()

    return cronResult
  } catch (err) {
    // Try to unblock the job at least
    // eslint-disable-next-line require-atomic-updates
    cronJob.running = false
    await cronJob.save()

    throw err
  }
}
