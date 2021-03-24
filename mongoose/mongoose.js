const mongoose = require("mongoose");

const schema = mongoose.Schema;

const placeSchema = new schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  image: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    long: { type: Number },
    lat: { type: Number },
  },
  author: { type: String, required: true },
  authorPhoto: { type: String, required: true },
  date: { type: Number, required: true },
  love: { type: Number, required: true },
});

const userSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  userPhoto: { type: String, required: true },
  fav: [{ type: String }],
});
userSchema.index({ name: "text" });

exports.placeModel = mongoose.model("place", placeSchema);
exports.userModel = mongoose.model("user", userSchema);
