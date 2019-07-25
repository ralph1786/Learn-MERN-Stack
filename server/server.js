const express = require("express");
const mongoose = require("mongoose");
const config = require("config");

//Bringing routes in
const reminders = require("./routes/api/remindersRoutes.js");
const users = require("./routes/api/userRoutes.js");
const auth = require("./routes/api/auth.js");

//DB config
const db = config.get("mongoURI");

const app = express();

app.use(express.json());
mongoose.set("useFindAndModify", false);

//Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Use Routes
app.use("/api/reminder", reminders);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("server started..."));
