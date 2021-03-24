const express = require("express");

const router = express.Router();

const fileUpload = require("../multer/multer");
const User = require("../mongoose/mongoose").userModel;

router.post("/login", async (req, res, next) => {
  let data = req.body;
  let [email, password] = [data.email, data.password];
  const result = await User.find({ email });
  if (result.length > 0) {
    let user = result[0];
    if (user.password == password) {
      res.status(200);
      res.json({
        message: "User found.",
        name: user.name,
        places: user.places,
        fav: user.fav,
        email: user.email,
        userPhoto: user.userPhoto,
        id: user._id,
      });
    } else {
      res.status(404);
      res.json({ message: "Wrong Credentials." });
    }
  } else {
    res.status(404);
    res.json({ message: "Can't find User with this email." });
  }
});

router.post("/signup", fileUpload.single("image"), async (req, res, next) => {
  let data = req.body;
  let createdUser = new User({
    ...data,
    userPhoto: req.file.path,
    places: [],
    fav: [],
  });

  const result = await User.find({ email: data.email });
  if (result.length > 0) {
    res.status(404);
    res.json({
      message: "User email already exists. Try to login.",
    });
  } else {
    res.status(201);
    createdUser
      .save()
      .then((user) => {
        res.json({
          name: user.name,
          places: user.places,
          fav: user.fav,
          email: user.email,
          userPhoto: user.userPhoto,
          message: "User created successfully",
          id: user._id,
        });
      })
      .catch(() => {
        res.status(404);
        res.json({ message: "Error in creating new User." });
      });
  }
});

module.exports = router;
