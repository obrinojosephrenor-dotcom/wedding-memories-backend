const express = require("express");
const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  registerGuest,
  loginGuest,
  getProfile,
} = require("../controllers/authController");

router.post(
  "/register",
  registerGuest
);

router.post(
  "/login",
  loginGuest
);

router.get(
  "/me",
  protect,
  getProfile
);

module.exports = router;