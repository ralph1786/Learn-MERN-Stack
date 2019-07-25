const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authmiddleware.js");
const config = require("config");
const jwt = require("jsonwebtoken");

//Reminder Model
const Reminder = require("../../Models/Reminder");

//GET api/reminder
//Gets all reminders
router.get("/", (req, res) => {
  Reminder.find()
    .sort({ date: -1 })
    .then(reminders => {
      res.json(reminders);
    });
});

//POST api/reminder
//Create reminder
router.post("/", authMiddleware, (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtSecret"));
  const newReminder = new Reminder({
    title: req.body.title,
    author: decoded.id
  });

  newReminder
    .save()
    .then(reminder => res.json(reminder))
    .catch(err => console.log(err));
});

//PUT api/reminder/:id
//Update reminder
router.put("/:id", authMiddleware, (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtSecret"));
  if (req.body.author == decoded.id) {
    Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, reminder) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error could not update", err });
        } else {
          return res.status(200).json(reminder);
        }
      }
    );
  } else {
    return res.status(404).json({ message: "Not Allowed To Update Reminder" });
  }
});

//DELETE api/reminder/:id
//Delete reminder
router.delete("/:id", authMiddleware, (req, res) => {
  const token = req.header("x-auth-token");
  const decoded = jwt.verify(token, config.get("jwtSecret"));
  Reminder.findById(req.params.id)
    .then(reminder => {
      if (reminder.author == decoded.id) {
        reminder.remove().then(() => res.json({ message: "Reminder deleted" }));
      } else {
        res.status(404).json({ message: "Not Allowed To Delete" });
      }
    })
    .catch(err =>
      res.status(404).json({ message: "Reminder not deleted", err })
    );
});

module.exports = router;
