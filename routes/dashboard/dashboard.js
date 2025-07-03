const verifyJWT = require("../../middlewares/authMiddleware")
const express = require("express")

// Importing Database Models
const router = express.Router()

// Controllers:
const {
  dashboardController,
} = require("../../controllers/dashboard/dashboardController")

// ROOT: /api/dashboard/details
router.get("/", verifyJWT, dashboardController)

module.exports = router
