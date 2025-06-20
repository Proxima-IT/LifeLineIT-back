const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
  deleteStudent,
} = require("../../controllers/admin/studentController") // Student Controller
const { addCourse } = require("../../controllers/admin/courseController") // Course Controller

// ADMIN Operation: Student

router.get("/student/list", getStudents) // GET
router.post("/student/create", createStudent) // POST
// PUT
//
router.delete("/student/delete/:id", deleteStudent) // DELETE

// ADMIN Operation: Course
router.post("/course/add", addCourse) // POST

module.exports = router
