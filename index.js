const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

const MONGO_URL = process.env.MONGO_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connected to database");
  } catch (error) {
    console.error("couldn't connect to database. err:", error.message);
  }
};
connectToDB();

const userSchema = mongoose.Schema({
  username: String,
  count: Number,
  log: [
    {
      description: String,
      duration: Number,
      date: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);

app.post("/api/users", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.json({ msg: "please enter username." });
  }

  try {
    const createUser = await User.create({ username });
    console.log("user created", createUser);
    const newUser = await User.findOne(
      { _id: createUser._id },
      { username: 1, _id: 1 }
    );
    const orderedDocument = {
      username: newUser.username,
      _id: newUser._id,
    };
    res.json(orderedDocument);
  } catch (err) {
    console.error(`couldn't create new user. Error: ${err.message}`);
    res.status(500).json({ err: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const userArray = await User.find(
      { username: { $exists: true } },
      { username: 1, _id: 1 }
    );
    console.log(userArray);
    const orderedDocuments = userArray.map((doc) => ({
      username: doc.username,
      _id: doc._id,
    }));
    res.json(orderedDocuments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ err: err.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  if (!description) {
    return res.json({ msg: "description is required" });
  }
  if (!duration || Number(duration) <= 0) {
    return res.json({ msg: "duration not provided or negative" });
  }
  const logDate = date
    ? new Date(date).toDateString()
    : new Date().toDateString();

  try {
    // Find user
    const user = await User.findById(_id);
    if (!user) {
      return res.json({ msg: `couldn't find user with id ${_id}` });
    }

    const objLog = {
      description,
      duration: Number(duration),
      date: logDate,
    };

    // Update user with new log entry
    await User.findByIdAndUpdate(
      _id,
      {
        $push: { log: objLog },
      },
      { new: true }
    );

    // Recalculate count and update it separately
    const updatedUser = await User.findById(_id);
    const logCount = updatedUser.log.length;

    await User.findByIdAndUpdate(
      _id,
      { $set: { count: logCount } },
      { new: true }
    );

    const returnObj = await User.findById(_id, { log: 0, __v: 0, count: 0 });

    return res.json({ ...returnObj.toObject(), ...objLog });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ err: err.message });
  }
});

app.get("/api/users/:_id/logs", async (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  if (!_id) {
    return res.json({ msg: "no user id entered" });
  }
  try {
    const userLog = await User.findById(_id, { __v: 0 });

    if (limit) {
      const log = userLog.log;
      const trimmedLog = log.splice(0, Number(limit));
      const queriedUserLog = { username: userLog.username, count: userLog.count, _id: userLog._id, log: trimmedLog}
      return res.json(queriedUserLog);
    }
    return res.json(userLog);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
});

const PORT = process.env.PORT || 3000;
const listener = app.listen(PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
