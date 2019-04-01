const CronJob = require("../../lib/model/CronJob")

describe("CronJob", () => {
  describe("Schema.method.shouldRun", () => {
    it("returns true when lastExecuted plus the interval is in the past", () => {
      expect(
        CronJob.Schema.methods.shouldRun.apply({
          lastExecuted: Date.now() - 2000,
          interval: "1s",
        })
      ).toBe(true)
    })

    it("returns false, when lastExecuted wasnt long enough ago", () => {
      expect(
        CronJob.Schema.methods.shouldRun.apply({
          lastExecuted: Date.now() - 2000,
          interval: "5s",
        })
      ).toBe(false)
    })
  })
})
