const express = require("express")
const router = express.Router()
const {
  otpVerification,
  register,
  login,
} = require("../controllers/authController")

const { verifyJWT } = require("../middlewares/authMiddleware")

// ROOT: /api/auth
router.post("/otp-verify", otpVerification)
router.post("/register", register)
router.post("/login", login)

router.get("/check", verifyJWT, (req, res) => {
  res.json({ loggedIn: true, user: req.user })
}) // Checking if JWT is valid or not.

module.exports = router
