const TypedError = require("error/typed")

exports.InvalidConfigurationError = TypedError({
  type: "configuration",
  message: "{title} configuration error",
  title: null,
})

exports.HTTPStatusError = TypedError({
  type: "server",
  message: "{title} server error, status={statusCode}",
  title: null,
  statusCode: null,
})
