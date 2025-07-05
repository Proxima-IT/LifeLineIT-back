const express = require("express")
const router = express.Router()
const {
  getCourses,
  getCoursesByName,
  getCoursesBySearch,
} = require("../controllers/courseController")
const { addCourse } = require("../controllers/admin/courseController") // Course Controller

// ROOT: /api/courses
router.get("/", getCourses) // get All Courses
router.get("/search", getCoursesBySearch) // get Course by Search
router.get("/:name", getCoursesByName) // get Course by route

// ADMIN Operation: Course
router.post("/add", addCourse) // POST

module.exports = router
