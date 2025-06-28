const express = require("express")
const router = express.Router()
const {
  getCourses,
  getCoursesByName,
} = require("../controllers/courseController")
const { addCourse } = require("../controllers/admin/courseController") // Course Controller

// ROOT: /api/courses
router.get("/", getCourses) // get All Courses
router.get("/:name", getCoursesByName) // get Course by ID

// ADMIN Operation: Course
router.post("/add", addCourse) // POST

module.exports = router
