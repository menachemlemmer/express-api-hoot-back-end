const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const usersRouter = require("./controllers/users");
const hootsRouter = require("./routes/hoots.js");

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);
app.use("/hoots", hootsRouter);

app.listen(3000, () => {
  console.log("The express app is ready!");
});
