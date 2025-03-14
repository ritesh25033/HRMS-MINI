// const express = require("express");
// const { registerUser, loginUser, getUserProfile } = require("../controllers/authController");
// const { protect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/register", protect, registerUser); // Only logged-in users can register
// router.post("/login", loginUser);
// router.get("/me", protect, getUserProfile);

// module.exports = router;


const express = require("express")
const { register, login } = require("../controllers/auth")

const router = express.Router()

router.post("/register", register)
router.post("/login", login)

module.exports = router

