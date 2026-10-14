const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  getProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const { loginLimiter } = require("../middleware/rateLimitterMiddleware");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/validationMiddleware");

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, loginLimiter, login);
router.post("/logout", logout);
router.get("/profile", protect, getProfile);
router.put("/password", protect, changePassword);

module.exports = router;
