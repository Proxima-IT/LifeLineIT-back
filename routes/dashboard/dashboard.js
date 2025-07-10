const express = require("express")

// Importing Database Models
const router = express.Router()

// JWT Datas
const verifyJWT = require("../../middlewares/authMiddleware")

// Controllers:
const {
  dashboardController,
} = require("../../controllers/dashboard/dashboard.controller")

const {
  addNotice,
  viewNotice,
} = require("../../controllers/dashboard/notice.controller")

const {
  registrationController,
} = require("../../controllers/dashboard/registration.controller")

const resetInfo = require("../../controllers/dashboard/profile.controller")

// ROOT: /api/dashboard
router.get("/", verifyJWT, dashboardController)
router.get("/notices", viewNotice)
router.post("/notices", addNotice)
router.post("/reset", verifyJWT, resetInfo)

router.post("/registration", registrationController)
// router.post("/certificate", registrationController)

module.exports = router
