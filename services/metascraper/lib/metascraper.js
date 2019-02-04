const metascraper = require("metascraper")([
  require("metascraper-author")(),
  require("metascraper-date")(),
  require("metascraper-description")(),
  require("metascraper-title")(),
  require("metascraper-url")(),
])

const got = require("got")
const query = require("micro-query")
const microCors = require("micro-cors")

const cors = microCors({ allowMethods: ["GET"] })

const handler = async (req, res) => {
  const { targetUrl } = query(req)

  if (!targetUrl || !targetUrl.trim()) {
    return {
      error: "No targetUrl given",
    }
  }

  try {
    const { body: html, url } = await got(targetUrl)

    const metadata = await metascraper({ html, url })

    return res.json(metadata)
  } catch (err) {
    if (err) {
      return {
        error: err.message,
      }
    }
  }
}

module.exports = cors(handler)
