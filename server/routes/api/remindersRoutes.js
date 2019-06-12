const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authmiddleware.js");

//Reminder Model
const Reminder = require("../../Models/Reminder");

//GET api/reminder
//Gets all reminders
router.get("/", (req, res) => {
  Reminder.find()
    .sort({ date: -1 })
    .then(reminders => res.json(reminders));
});

//POST api/reminder
//Create reminder
router.post("/", authMiddleware, (req, res) => {
  const newReminder = new Reminder({
    title: req.body.title
  });

  newReminder
    .save()
    .then(reminder => res.json(reminder))
    .catch(err => console.log(err));
});

//PUT api/reminder/:id
//Update reminder
router.put("/:id", authMiddleware, (req, res) => {
  Reminder.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, reminder) => {
      if (err) {
        return res.status(500).json({ message: "Action cannot be processed" });
      }
      return res.status(200).json(reminder);
    }
  );
});

//DELETE api/reminder/:id
//Delete reminder
router.delete("/:id", authMiddleware, (req, res) => {
  Reminder.findById(req.params.id)
    .then(reminder =>
      reminder.remove().then(() => res.json({ message: "Reminder deleted" }))
    )
    .catch(err => res.status(404).json({ message: "Reminder not deleted" }));
});

module.exports = router;
