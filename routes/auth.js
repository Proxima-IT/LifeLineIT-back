const express = require("express")
const router = express.Router()
const {
  otpVerification,
  registerController,
  loginController,
  logoutController,
} = require("../controllers/authController")

const verifyJWT = require("../middlewares/authMiddleware")

// ROOT: /api/auth
router.post("/otp-verify", otpVerification)

router.post("/register", registerController)

router.post("/login", loginController)

router.post("/logout", logoutController) // Logout Route

router.get("/check", verifyJWT, (req, res) => {
  res.json({ status: true, user: req.user })
}) // Checking if JWT is valid or not.

module.exports = router
