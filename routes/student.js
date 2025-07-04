const express = require("express")
const router = express.Router()
// Controllers
const {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/admin/studentController") // Student Controller

// ADMIN Operation: Student

// ROOT: /api/student
router.get("/", getStudents) // GET
router.post("/create", createStudent) // POST
// PUT
router.put("/update", updateStudent) // POST

//
router.delete("/delete/:id", deleteStudent) // DELETE

module.exports = router
