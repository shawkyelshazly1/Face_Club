const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const s = require("underscore.string");

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
    trim: true,
    lowercase: true,
  },
  last_name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 25,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    trim: true,
    minlength: 1,
    maxlength: 25,
    lowercase: true,
  },
  email: { type: String, required: true, trim: true, lowercase: true },
  password: { type: String, required: true, trim: true },
  is_member: { type: Boolean, default: false },
  is_admin: { type: Boolean, default: false },
});

userSchema.virtual("full_name").get(function () {
  return `${s(this.first_name)
    .trim()
    .capitalize()
    .value()} ${s(this.last_name).trim().capitalize().value()}`;
});

userSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

module.exports = mongoose.model("User", userSchema);
