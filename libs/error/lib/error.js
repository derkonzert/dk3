const TypedError = require("error/typed")

exports.InvalidConfigurationError = TypedError({
  type: "configuration",
  message: "{title} configuration error",
  title: null,
})

exports.HTTPStatusError = TypedError({
  type: "server",
  message: "{title}, status={statusCode}",
  title: null,
  statusCode: null,
})
