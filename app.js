const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const placeRoute = require("./routes/place-route");
const userRoute = require("./routes/user-route");
const authRoute = require("./routes/auth-route");
const uri = require("./mongoUri");
const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/uploads/image", express.static(path.join("uploads", "image")));
app.use(bodyParser.json());
app.use("/places", placeRoute);
app.use("/users", userRoute);
app.use("/auth", authRoute);

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.error("Cannot connect :(", err);
  });
