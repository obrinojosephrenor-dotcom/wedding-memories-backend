const express = require("express");
const router = express.Router();

const upload =
  require("../middleware/uploadMiddleware");

const protect =
  require("../middleware/authMiddleware");

const {
  uploadPhoto,
  getMyPhotos,
} = require("../controllers/uploadController");

/*
|--------------------------------------------------------------------------
| GET MY PHOTOS
|--------------------------------------------------------------------------
*/
router.get(
  "/my-photos",
  protect,
  getMyPhotos
);

/*
|--------------------------------------------------------------------------
| UPLOAD PHOTO
|--------------------------------------------------------------------------
*/
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadPhoto
);

module.exports = router;