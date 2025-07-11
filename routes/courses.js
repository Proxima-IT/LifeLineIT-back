const express = require("express")
const router = express.Router()
const {
  getCourses,
  getCoursesByName,
  getCoursesBySearch,
} = require("../controllers/course.controller")
// ADMIN CONTROLLERS
const { addCourse } = require("../controllers/course.controller") // Course Controller

const rateLimit = require("express-rate-limit")

function rateLimiter(time, limit, message) {
  return rateLimit({
    windowMs: time, // 1 hour
    max: limit,
    message: {
      status: false,
      message: message,
    },
  })
}

// ROOT: /api/courses
router.get("/", rateLimiter(60 * 5 * 1000, 60, "Too many Requests"), getCourses) // get All Courses
router.get("/search", getCoursesBySearch) // get Course by Search
router.get("/:name", getCoursesByName) // get Course by route

// ADMIN Operation: Course
router.post("/add", addCourse) // POST

module.exports = router
