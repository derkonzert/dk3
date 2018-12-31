const bcrypt = require("bcrypt")
const mongoose = require("mongoose")

const config = require("@dk3/config")

const skills = require("./userSkills")

const Schema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: true,
  },

  passwordHash: {
    type: String,
    required: true,
  },

  skills: {
    type: [String],
    default: [skills.LOGIN],
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
