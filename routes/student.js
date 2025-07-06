const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
  resetStudent,
  deleteStudent,
} = require("../controllers/admin/studentController") // Student Controller
const verifyJWT = require("../middlewares/authMiddleware")

// ADMIN Operation: Student

// ROOT: /api/student
router.get("/", getStudents) // GET
router.post("/create", createStudent) // POST
// PUT
router.put("/reset", verifyJWT, resetStudent) // POST

//
router.delete("/delete/:id", deleteStudent) // DELETE

module.exports = router
