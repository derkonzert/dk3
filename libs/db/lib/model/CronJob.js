const ms = require("ms")
const mongoose = require("mongoose")

const schemaDefinition = {
  name: { type: String, unique: true },
  interval: String,
  lastExecuted: {
    type: Date,
    default: function() {
      if (!this.initialRun) {
        return new Date()
      }
      return undefined
    },
  },
  initialRun: { type: Boolean, default: false },
  running: { type: Boolean, default: false },
}

exports.schemaDefinition = schemaDefinition

const Schema = new mongoose.Schema(schemaDefinition)

Schema.methods.shouldRun = function() {
  if (!this.lastExecuted) {
    return true
  }

  const now = Date.now()
  const lastExecutedTimestamp = new Date(this.lastExecuted).getTime()
  const intervalMs = ms(this.interval)

  return lastExecutedTimestamp + intervalMs <= now
}

exports.Schema = Schema

exports.Model = mongoose.model("CronJob", Schema)
