const express = require("express")
const router = express.Router()
const {
  otpVerification,
  registerController,
  loginController,
  logoutController,
} = require("../controllers/auth.controller")

const verifyJWT = require("../middlewares/authMiddleware")

const rateLimit = require("express-rate-limit")

function rateLimiter(time, limit, message) {
  return rateLimit({
    windowMs: time,
    max: limit,
    message: {
      status: false,
      message: message,
    },
  })
}

// ROOT: /api/auth
router.post(
  "/otp-verify",
  rateLimiter(3600 * 1000, 3, "Otp Limit Exceed! Please try again af an hour."),
  otpVerification
)

router.post("/register", registerController)

router.post(
  "/login",
  rateLimiter(60 * 15 * 1000, 5, "Login limit exceed! Please try again later."),
  loginController
)

router.post(
  "/logout",
  rateLimiter(3600 * 2 * 1000, 4, "Please try again later."),
  logoutController
) // Logout Route

router.get("/check", verifyJWT, (req, res) => {
  res.json({ status: true, user: req.user })
}) // Checking if JWT is valid or not.

module.exports = router
