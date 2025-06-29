const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
  deleteStudent,
} = require("../controllers/admin/studentController") // Student Controller

// ADMIN Operation: Student

// ROOT: /api/student
router.get("/list", getStudents) // GET
router.post("/create", createStudent) // POST
// PUT
//
router.delete("/student/delete/:id", deleteStudent) // DELETE

module.exports = router
