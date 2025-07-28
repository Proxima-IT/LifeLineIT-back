const {
  getGeneralSettings,
  addGeneralSettings,
} = require("@controllers/admin/general.controller")
const express = require("express")
const router = express.Router()

// ROOT: /api/general
router.get("/", getGeneralSettings) // GET
router.post("/", addGeneralSettings) // POST

module.exports = router
