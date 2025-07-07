const express = require("express")
const router = express.Router()
const {
  getCourses,
  getCoursesByName,
  getCoursesBySearch,
} = require("../controllers/course.controller")
// ADMIN CONTROLLERS
const { addCourse } = require("../controllers/course.controller") // Course Controller

// ROOT: /api/courses
router.get("/", getCourses) // get All Courses
router.get("/search", getCoursesBySearch) // get Course by Search
router.get("/:name", getCoursesByName) // get Course by route

// ADMIN Operation: Course
router.post("/add", addCourse) // POST

module.exports = router
