"use strict"

const { InvalidConfigurationError } = require("@dk3/error")

const config = { ...process.env }

const validate = (name, throwOnError = true) => {
  if (throwOnError && !config.hasOwnProperty(name)) {
    throw new InvalidConfigurationError(`Config "${name}" missing in env`)
  }
}

exports.get = (name, throwOnError) => {
  validate(name, throwOnError)

  return config[name]
}
