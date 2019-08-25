const CronJob = require("./model/CronJob")
jest.mock("./model/CronJob")
const cronJobs = require("./cronJobs")
jest.mock("./cronJobs")

const cron = require("./cron")

describe("cron", () => {
  describe("createJob", () => {
    const options = { foo: "bar", one: 2 }
    let model

    beforeEach(() => {
      model = { save: jest.fn() }

      CronJob.Model.mockImplementation(() => model)
    })

    it("creates and saves new model", async () => {
      await cron.createJob(options)

      expect(CronJob.Model).toHaveBeenCalledWith(options)
      expect(model.save).toHaveBeenCalledTimes(1)
    })

    it("fails silently when job creation because of mongoose error", () => {
      expect.assertions(1)

      CronJob.Model.mockImplementationOnce(() => {
        throw new Error("MongoError: E11000 duplicate entry")
      })

      return expect(cron.createJob(options)).resolves.toBe(undefined)
    })
  })

  describe("setup", () => {
    let origCreateJob

    beforeAll(() => {
      origCreateJob = cron.createJob
      cron.createJob = jest.fn()
    })

    afterAll(() => {
      cron.createJob = origCreateJob
    })

    it("calls createJob x times", async () => {
      await cron.setup()

      expect(cron.createJob).toHaveBeenCalledTimes(
        cron.cronJobConfigurations.length
      )
    })
  })

  describe("runJob", () => {
    let save = jest.fn()

    beforeEach(() => {
      save.mockReset()
      cronJobs.testJob = jest.fn().mockResolvedValue({ message: "Test" })
    })

    it("rejects when no cron function can be found", () => {
      expect.assertions(1)

      return expect(cron.runJob({ name: "gibts nicht" })).rejects.toThrow()
    })

    it("calls cron function by job name", async () => {
      await cron.runJob({ name: "testJob", save })

      expect(cronJobs.testJob).toHaveBeenCalledTimes(1)
    })

    it("rejects when job fn throws", () => {
      expect.assertions(1)

      cronJobs.testJob.mockImplementationOnce(() => {
        throw new Error("HA! I throw")
      })

      return expect(cron.runJob({ name: "testJob", save })).rejects.toThrow(
        "HA! I throw"
      )
    })

    it("sets running property on job", async () => {
      const runningSetter = jest.fn()

      await cron.runJob({
        name: "testJob",
        save,
        _running: false,

        get running() {
          return this._running
        },

        set running(value) {
          this._running = value
          runningSetter(value)
          return value
        },
      })

      expect(runningSetter).toHaveBeenNthCalledWith(1, true)
      expect(runningSetter).toHaveBeenNthCalledWith(2, false)
    })

    it("sets lastExecuted if cron Fn sets shouldSetLastExecuted", async () => {
      cronJobs.testJob.mockResolvedValueOnce({ shouldSetLastExecuted: true })

      const testExecutionStarted = Date.now()
      const job = {
        name: "testJob",
        lastExecuted: Date.now() - 9000,
        save,
      }

      await cron.runJob(job)

      expect(new Date(job.lastExecuted).getTime()).toBeGreaterThanOrEqual(
        testExecutionStarted
      )
    })

    it("does not set lastExecuted if shouldSetLastExecuted was false", async () => {
      cronJobs.testJob.mockResolvedValueOnce({ shouldSetLastExecuted: false })

      const lastExecuted = Date.now() - 9000
      const job = {
        name: "testJob",
        lastExecuted,
        save,
      }

      await cron.runJob(job)

      expect(new Date(job.lastExecuted).getTime()).toEqual(lastExecuted)
    })
  })

  describe("runAll", () => {
    let origNow
    let mockJob

    beforeAll(() => {
      origNow = Date.now
      Date.now = jest.fn()
    })

    afterAll(() => {
      Date.now = origNow
    })

    beforeEach(() => {
      mockJob = { name: "testJob", shouldRun: jest.fn(), save: jest.fn() }
      cronJobs.testJob = jest.fn().mockResolvedValue({ message: "Test" })

      CronJob.Model.find = jest.fn().mockReturnValue(CronJob.Model)
      CronJob.Model.sort = jest.fn().mockReturnValue(CronJob.Model)
      CronJob.Model.exec = jest
        .fn()
        .mockReturnValue([mockJob, mockJob, mockJob])

      Date.now.mockReturnValue(0)
    })

    it("queries for jobs not currently running, sorted by last execution time", async () => {
      await cron.runAll()

      expect(CronJob.Model.find).toHaveBeenCalledWith({
        running: false,
      })
      expect(CronJob.Model.sort).toHaveBeenCalledWith({
        lastExecuted: -1,
      })
      expect(CronJob.Model.exec).toHaveBeenCalledTimes(1)
    })

    it("calls job functions related to found jobs", async () => {
      mockJob.shouldRun.mockReturnValue(true)

      await cron.runAll()

      expect(mockJob.shouldRun).toHaveBeenCalledTimes(3)
      expect(cronJobs.testJob).toHaveBeenCalledTimes(3)
    })

    it("cancels run when jobs take longer than one minute", async () => {
      mockJob.shouldRun.mockReturnValue(true)

      /* startedAt 0 */
      Date.now.mockReturnValueOnce(0)
      /* first job took 30 seconds */
      Date.now.mockReturnValueOnce(30 * 1000)
      /* second job took 31 seconds */
      Date.now.mockReturnValueOnce(61 * 1000)
      /* third job should not start */

      await cron.runAll()

      expect(mockJob.shouldRun).toHaveBeenCalledTimes(2)
      expect(cronJobs.testJob).toHaveBeenCalledTimes(2)
    })
  })
})
