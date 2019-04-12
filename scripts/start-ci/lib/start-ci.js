const path = require("path")
const { override } = require("@dk3/config")

const { execPromised } = require("./execPromised")

module.exports = async function startCi() {
  const seed = require("@dk3/seed/lib/seed")

  const MongoMemoryServer = require("mongodb-memory-server").default

  try {
    const mongod = new MongoMemoryServer()
    const uriString = await mongod.getConnectionString()

    override("MONGODB_URI", uriString)

    /* Seeding fresh data */
    await seed()

    /* Starting Applications (lambdas + frontends) */
    await Promise.all([
      execPromised(`MONGODB_URI=${uriString} yarn dev`, {
        cwd: path.resolve(__dirname, "../../../"),
        maxBuffer: 1024 * 500,
      }),
      execPromised(`MONGODB_URI=${uriString} yarn dev`, {
        cwd: path.resolve(__dirname, "../../../frontend/main"),
        maxBuffer: 1024 * 500,
      }),
    ])

    return { uriString }
  } catch (err) {
    throw err
  }
}
