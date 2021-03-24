const multer = require("multer");

const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};

const fileUpload = multer({
  limits: 100000,
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/image");
    },
    filename: (req, file, cb) => {
      const ext = MINE_TYPE_MAP[file.mimetype];
      cb(null, Date.now() + "_" + Math.random() * 4 + "." + ext);
    },
  }),
});

module.exports = fileUpload;
