const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//Create Schema
const ReminderSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  completed: {
    type: Boolean,
    default: false
  }
});

module.exports = Reminder = mongoose.model("Reminder", ReminderSchema);
