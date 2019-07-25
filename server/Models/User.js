const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  registration_date: {
    type: Date,
    default: Date.now
  },
  reminders: [{ type: Schema.Types.ObjectId, ref: "Reminder" }]
});

module.exports = User = mongoose.model("User", UserSchema);
