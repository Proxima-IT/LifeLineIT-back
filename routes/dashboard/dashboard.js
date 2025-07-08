const verifyJWT = require("../../middlewares/authMiddleware")
const express = require("express")

// Importing Database Models
const router = express.Router()

// Controllers:
const {
  dashboardController,
} = require("../../controllers/dashboard/dashboard.controller")

const {
  addNotice,
  viewNotice,
} = require("../../controllers/dashboard/notice.controller")

// ROOT: /api/dashboard
router.get("/", verifyJWT, dashboardController)
router.get("/notices", viewNotice)
router.post("/notices", addNotice)

module.exports = router
