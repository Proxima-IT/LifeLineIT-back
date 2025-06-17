const express = require("express")
const router = express.Router()
const {
  getStudents,
  createStudent,
  deleteStudent,
  addCourse,
} = require("../../controllers/adminController")

// ADMIN Operation: Student

// GET
router.get("/student/list", getStudents)
// POST
router.post("/student/create", createStudent)
// PUT
//
// DELETE
router.delete("/student/delete/:id", deleteStudent)

// ADMIN Operation: Course
// POST
router.post("/course/add", addCourse)

module.exports = router
