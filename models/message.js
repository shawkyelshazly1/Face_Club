const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const s = require("underscore.string");

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200,
  },
  author: { type: mongoose.SchemaTypes.ObjectId, ref: "User", required: true },
  created_at: { type: Date, default: Date.now },
});

messageSchema.virtual("url").get(function () {
  return `/message/${this._id}`;
});

module.exports = mongoose.model("Message", messageSchema);
