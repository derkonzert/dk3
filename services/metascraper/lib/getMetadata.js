const got = require("got")

exports.getMetadata = async targetUrl => {
  const metascraper = require("metascraper")([
    require("metascraper-author")(),
    require("metascraper-date")(),
    require("metascraper-description")(),
    require("metascraper-title")(),
    require("metascraper-url")(),
  ])

  if (!targetUrl || !targetUrl.trim()) {
    throw new Error("No targetUrl given")
  }

  try {
    const { body: html, url } = await got(targetUrl)

    const metadata = await metascraper({ html, url })

    return metadata
  } catch (err) {
    throw err
  }
}
