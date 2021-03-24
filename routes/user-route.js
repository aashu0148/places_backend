const express = require("express");
const router = express.Router();

const User = require("../mongoose/mongoose").userModel;
const Place = require("../mongoose/mongoose").placeModel;

router.get("/:uid", async (req, res, next) => {
  const uid = req.params.uid;
  let result;
  try {
    result = await User.find({ _id: uid }, "-password");
  } catch {
    res.status(404);
    res.json({ message: "User not found :(" });
  }
  if (result.length == 0) {
    res.status(404);
    res.json({ message: "User not found :(" });
  } else {
    res.status(200);
    res.json(result[0].toObject({ getters: true }));
  }
});

router.get("/:uid/places", async (req, res, next) => {
  const uid = req.params.uid;
  const result = await Place.find({ author: uid });
  if (result.length == 0) {
    res.status(404);
    res.json({ message: "No places found." });
  } else {
    res.status(200);
    res.json(result.map((place) => place.toObject({ getters: true })));
  }
});

router.get("/", async (req, res, next) => {
  const result = await User.find({}, "-password");
  res.json(result.map((user) => user.toObject({ getters: true })));
});

router.get("/search/:searchId", async (req, res, next) => {
  const searchId = req.params.searchId;
  const query = new RegExp(searchId, "i");
  const result = await User.find({ name: query }, "-password");
  if (result.length == 0) {
    res.status(404);
    res.json({ message: "No users found." });
  } else {
    res.status(200);
    res.json(result.map((user) => user.toObject({ getters: true })));
  }
});

router.post("/:uid", async (req, res, next) => {
  const uid = req.params.uid;
  const favPlaces = req.body;
  if (!favPlaces) return;
  const result = await User.findOne({ _id: uid });
  result.fav = favPlaces;
  result.save().then(() => res.json({ done: "true" }));
});

module.exports = router;
