const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
  deleteStudent,
} = require("../controllers/admin/studentController") // Student Controller

// ADMIN Operation: Student

// ROOT: /api/admin
router.get("/student/list", getStudents) // GET
router.post("/student/create", createStudent) // POST
// PUT
//
router.delete("/student/delete/:id", deleteStudent) // DELETE

module.exports = router
