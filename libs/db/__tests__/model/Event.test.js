const Event = require("../../lib/model/Event")

describe("Event", () => {
  describe("schemaDefinition", () => {
    it("checks if to date is after from date", () => {
      expect(
        Event.schemaDefinition.to.validate.validator.call(
          {
            from: new Date(2018, 11, 15),
          },
          new Date(2018, 11, 16)
        )
      ).toBe(true)

      expect(
        Event.schemaDefinition.to.validate.validator.call(
          {
            from: new Date(2018, 11, 15),
          },
          new Date(2018, 11, 14)
        )
      ).toBe(false)
    })

    it("it sets 'to's default to 2 hours after from", () => {
      const expectedDefault = new Date(2018, 11, 15, 17, 15)
      const createdDefault = Event.schemaDefinition.to.default.call({
        from: new Date(2018, 11, 15, 15, 15),
      })

      expect(createdDefault.toISOString()).toBe(expectedDefault.toISOString())
    })
  })
})
