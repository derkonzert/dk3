const path = require("path")
const { override } = require("@dk3/config")

const { execPromised } = require("./execPromised")

const ONE_MEGA_BYTE = 1024 * 1024
const MAX_BUFFER = ONE_MEGA_BYTE * 20

module.exports = async function startCi() {
  const seed = require("@dk3/seed/lib/seed")

  const MongoMemoryServer = require("mongodb-memory-server").default

  const mongod = new MongoMemoryServer()
  const uriString = await mongod.getConnectionString()

  override("MONGODB_URI", uriString)

  /* Seeding fresh data */
  await seed()

  /* Starting Applications (lambdas + frontends) */
  await Promise.all([
    execPromised(`MONGODB_URI=${uriString} yarn dev`, {
      cwd: path.resolve(__dirname, "../../../"),
      maxBuffer: MAX_BUFFER,
    }),
    execPromised(`MONGODB_URI=${uriString} yarn dev`, {
      cwd: path.resolve(__dirname, "../../../frontend/main"),
      maxBuffer: MAX_BUFFER,
    }),
  ])

  return { uriString }
}
