const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", protect, registerUser); // Only logged-in users can register
router.post("/login", loginUser);

module.exports = router;
