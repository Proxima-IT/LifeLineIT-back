const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
} = require("../controllers/admin/studentController") // Student Controller

// ADMIN Operation: Student

// ROOT: /api/student
router.get("/", getStudents) // GET
router.post("/create", createStudent) // POST

module.exports = router
