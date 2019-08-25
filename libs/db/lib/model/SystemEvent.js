const mongoose = require("mongoose")

mongoose.set("useCreateIndex", true)

exports.Types = {
  eventAdded: "event:added",
}

const schemaDefinition = {
  /* The system events type */
  type: {
    type: String,
    enum: Object.keys(exports.Types).map(key => exports.Types[key]),
    required: true,
  },

  /* Often, system events are emitted by a user */
  emittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  /* A related event */
  relatedEvent: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },

  /* The date the document was created */
  created: {
    type: Date,
    default: Date.now,
  },
}

exports.schemaDefinition = schemaDefinition

const Schema = new mongoose.Schema(schemaDefinition)

exports.Schema = Schema

exports.Model = mongoose.model("SystemEvent", Schema)
