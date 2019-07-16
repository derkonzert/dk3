const ms = require("ms")
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
    unique: true,
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
    default: false,
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

Schema.methods.createPasswordResetToken = async function() {
  this.passwordResetToken = await exports.generateBasicToken()
  this.passwordResetTokenExpiresAt = Date.now() + ms("15min")

  await this.save()
}

Schema.methods.createDoubleOptInToken = async function() {
  const token = await exports.generateBasicToken()

  this.emailVerificationToken = token
  this.emailVerificationTokenExpiresAt = Date.now() + ms("4days")

  await this.save()

  return this
}

Schema.statics.createPasswordHash = function(password) {
  return bcrypt.hashSync(password, config.get("PASSWORD_HASH_SALT_ROUNDS"))
}

exports.Schema = Schema

exports.Model = mongoose.model("User", Schema)

exports.generateBasicToken = async () =>
  new Promise((resolve, reject) => {
    require("crypto").randomBytes(48, function(err, buffer) {
      if (err) {
        return reject(err)
      }

      const token = buffer.toString("hex")
      resolve(token)
    })
  })
