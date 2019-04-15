const path = require("path")
const { override } = require("@dk3/config")

const { execPromised } = require("./execPromised")

const TEN_MEGA_BYTE = 1024 * 1024 * 10

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
        maxBuffer: TEN_MEGA_BYTE,
      }),
      execPromised(`MONGODB_URI=${uriString} yarn dev`, {
        cwd: path.resolve(__dirname, "../../../frontend/main"),
        maxBuffer: TEN_MEGA_BYTE,
      }),
    ])

    return { uriString }
  } catch (err) {
    throw err
  }
}
