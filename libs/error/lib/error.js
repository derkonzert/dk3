exports.InvalidConfigurationError = class InvalidConfigurationError extends Error {}
exports.HTTPStatusError = class HTTPStatusError extends Error {
  constructor(msg, status) {
    super(msg)
    this.status = status
  }

  getStatus() {
    return this.status
  }
}
