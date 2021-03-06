const { InvalidConfigurationError } = require("@dk3/error")

const defaults = require("./defaults")
const config = { ...defaults, ...process.env }

const validate = (name, throwOnError = true) => {
  if (throwOnError && !Object.prototype.hasOwnProperty.call(config, name)) {
    throw new InvalidConfigurationError({
      title: `Config "${name}" missing in env`,
    })
  }
}

exports.get = (name, throwOnError) => {
  validate(name, throwOnError)

  return config[name]
}

exports.override = (name, newValue) => {
  config[name] = newValue
}

exports.url = pathToAdd => {
  return `${config.APP_URL}/${pathToAdd.replace(/^\//, "")}`
}
