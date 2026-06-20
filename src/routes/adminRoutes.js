const express = require("express");

const router = express.Router();

const adminProtect =
  require("../middleware/adminAuthMiddleware");

const {
  adminLogin,
} = require("../controllers/adminController");

const {
  getDashboardStats,
} = require("../controllers/adminDashboardController");

router.post(
  "/login",
  adminLogin
);

router.get(
  "/dashboard",
  adminProtect,
  getDashboardStats
);

module.exports = router;