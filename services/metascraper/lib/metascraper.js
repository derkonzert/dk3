const query = require("micro-query")
const { sendJson } = require("@dk3/api-utils")

const { getMetadata } = require("./getMetadata")

const handler = async (req, res) => {
  const { targetUrl } = query(req)

  try {
    const metadata = getMetadata(targetUrl)

    return sendJson(res, 200, metadata)
  } catch (err) {
    if (err) {
      return sendJson(res, 400, {
        error: err.message,
      })
    }
  }
}

module.exports = handler
