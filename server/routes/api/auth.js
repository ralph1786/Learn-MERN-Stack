const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../../middleware/authmiddleware.js");

//Reminder Model
const User = require("../../Models/User");

//POST api/auth
//Authenticate user
router.post("/", (req, res) => {
  const { email, password } = req.body;

  //Simple validation
  if (!email || !password) {
    res.status(400).json({ message: "Please complete all required fields" });
  }

  //Check for existing user
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    //Validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({ message: "Invalid Credentials" });
      jwt.sign(
        { id: user.id },
        config.get("jwtSecret"),
        {
          expiresIn: 3600
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              reminders: user.reminders
            }
          });
        }
      );
    });
  });
});

//GET api/auth/user
//get user data
//.select() does not return the user's password.
router.get("/user", authMiddleware, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.json(user));
});

module.exports = router;
