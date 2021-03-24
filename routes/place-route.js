const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Place = require("../mongoose/mongoose").placeModel;
const fileUpload = require("../multer/multer");

router.get("/top", async (req, res, next) => {
  res.json(await Place.find({}, null, { sort: { love: -1 }, limit: 5 }));
});

router.get("/:pid/love/:love", async (req, res, next) => {
  const love = req.params.love;
  const pid = req.params.pid;
  const result = await Place.findOne({ _id: pid });

  if (love == -1 && req.love > 0) result.love += love;
  else if (love == 1) result.love += love;

  result.save();
});

router.get("/:pid", async (req, res, next) => {
  const pid = req.params.pid;
  try {
    const result = await Place.find({ _id: pid });
    res.json(result);
  } catch (err) {
    res.status(404);
    res.json({ message: "Invalid Place id", error: err });
  }
});

router.get("/", async (req, res, next) => {
  res.json(await Place.find({}, null, { sort: { date: -1 } }));
});

router.post("/fav", async (req, res, next) => {
  const body = req.body;

  const query = body.map((e) => mongoose.Types.ObjectId(e));
  const result = await Place.find({ _id: { $in: query } });

  if (result.length == 0) {
    res.status(404);
    res.json({ message: "No favorite places." });
  } else {
    res.status(200);
    res.json(result);
  }
});

router.post("/", fileUpload.single("image"), (req, res, next) => {
  let { title, desc, location, address, author, authorPhoto } = req.body;

  const lco = JSON.parse(location);
  let createdPlace = new Place({
    title,
    desc,
    location: lco,
    image: req.file.path,
    address,
    author,
    authorPhoto,
    date: new Date().getTime(),
    love: 0,
  });
  createdPlace.save();

  res.status(201).json({ done: "true" });
});

module.exports = router;
