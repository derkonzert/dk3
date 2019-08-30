const modelMockFactory = (name, schema) =>
  class ModelMock {
    constructor(data) {
      Object.keys(schema.methods).forEach(key => {
        this[key] = schema.methods[key]
      })

      Object.keys(schema.definitions).forEach(key => {
        this[key] = undefined
      })

      Object.keys(data).forEach(key => {
        this[key] = data[key]
      })

      Object.keys(schema.definitions).forEach(key => {
        const defaultValue = schema.definitions[key].default

        if (this[key] === undefined && defaultValue) {
          if (typeof defaultValue === "function") {
            this[key] = defaultValue.call(this)
          } else {
            this[key] = defaultValue
          }
        }
      })

      Object.keys(schema.definitions).forEach(key => {
        const { validate } = schema.definitions[key]

        if (validate) {
          if (typeof validate === "function") {
            if (!validate.call(this, this[key])) {
              throw new Error("Mock validate failed")
            }
          } else {
            if (!validate.validator.call(this, this[key])) {
              throw new Error(validate.message)
            }
          }
        }
      })
    }
  }

class ObjectIdMock {}

class SchemaMock {
  constructor(definitions) {
    this.methods = {}
    this.statics = {}

    this.definitions = definitions
  }

  index() {}
}

SchemaMock.Types = {
  ObjectId: ObjectIdMock,
}

module.exports = {
  connect: jest.fn(),
  set: jest.fn(),
  model(name, schema) {
    const Model = modelMockFactory(name, schema)

    Object.keys(schema.statics).forEach(key => {
      Model[key] = schema.statics[key]
    })

    return Model
  },
  Schema: SchemaMock,
}

/*username: {
    type: String,
    trim: true,
    required: true,
  }*/
