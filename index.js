//import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model("User", userSchema);

mongoose
  .connect(
    "mongodb+srv://DevLam:O8AkhlZfMtX0Dfic@cluster0.pnhzoxr.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(async () => {
    console.log("Connected to Database");

    const user = new User({
      username: "DevLam",
      password: "O8AkhlZfMtX0Dfic"
    });

    await user.save();
    console.log("User created");

    mongoose.connection.close();
  })

  .catch((err) => {
    console.log("Database connection failed", err.toString());
  });
