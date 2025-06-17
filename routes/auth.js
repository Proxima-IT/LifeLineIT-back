const express = require("express")
const router = express.Router()
const {
  otpVerification,
  register,
  login,
} = require("../controllers/authController")

router.post("/otp-verify", otpVerification)
router.post("/register", register)
router.post("/login", login)

module.exports = router
