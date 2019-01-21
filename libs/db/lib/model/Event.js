const mongoose = require("mongoose")

const { DateTime } = require("luxon")

const schemaDefinition = {
  /* The events title */
  title: {
    type: String,
  },
  /* List of artists involved with the event */
  artists: {
    type: [String],
  },
  /* Where is it happening? */
  location: {
    type: String,
    required: true,
  },
  /* Has the event been approved by an admin? */
  approved: {
    type: Boolean,
    default: false,
  },
  /* When does the event start? */
  from: {
    type: Date,
    index: true,
    required: true,
  },
  /* When does the event end? Defaults to 2 hours after "from" */
  to: {
    type: Date,
    validate: {
      validator: function toValidator(to) {
        return DateTime.fromJSDate(to) > DateTime.fromJSDate(this.from)
      },
      message: "To date {VALUE} must be after from-date",
    },
    default: function setEventToDateDefault() {
      const from = DateTime.fromJSDate(this.from)

      return from.plus({ hours: 2 }).toJSDate()
    },
  },
  created: {
    type: Date,
    default: Date.now,
  },
  /* Who authored this? Can be null, due to possible anonymous submissions */
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  /* Who has the event in his list? */
  bookmarkedBy: { type: [mongoose.Schema.Types.ObjectId], ref: "User" },
}

exports.schemaDefinition = schemaDefinition

const Schema = new mongoose.Schema(schemaDefinition)

exports.Schema = Schema

exports.Model = mongoose.model("Event", Schema)
