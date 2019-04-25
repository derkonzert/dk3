const bcrypt = require("bcrypt")
const shortid = require("./shortid")
const mongoose = require("mongoose")

const config = require("@dk3/config")

const skills = require("./userSkills")

const Schema = new mongoose.Schema({
  shortId: {
    type: String,
    unique: true,
    default: shortid.generate,
  },

  lastLogin: {
    type: Date,
    default: null,
  },

  username: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },

  emailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: {
    type: String,
  },

  emailVerificationTokenExpiresAt: {
    type: Number,
  },

  passwordResetToken: {
    type: String,
  },

  passwordResetTokenExpiresAt: {
    type: Number,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    default: [],
  },

  sendEmails: {
    type: Boolean,
    default: true,
  },

  autoBookmark: {
    type: Boolean,
    default: true,
  },

  publicUsername: {
    type: Boolean,
    default: false,
  },

  calendarToken: {
    type: String,
  },

  created: {
    type: Date,
    default: Date.now,
  },
})

Schema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash)
}

Schema.methods.hasSkill = function(skill) {
  return (
    this.skills.indexOf(skill) >= 0 || this.skills.indexOf(skills.MAGIC) >= 0
  )
}

Schema.statics.createPasswordHash = function(password) {
  return bcrypt.hashSync(password, config.get("PASSWORD_HASH_SALT_ROUNDS"))
}

exports.Schema = Schema

exports.Model = mongoose.model("User", Schema)
