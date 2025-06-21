const express = require("express")
const router = express.Router()
const { getCourses } = require("../controllers/courseController")
const { addCourse } = require("../controllers/admin/courseController") // Course Controller

// ROOT: /api/courses
router.get("/", getCourses)

// ADMIN Operation: Course
router.post("/add", addCourse) // POST

module.exports = router
