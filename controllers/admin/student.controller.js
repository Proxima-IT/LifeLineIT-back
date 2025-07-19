const Student = require("../../models/Student")
const Course = require("../../models/Course")
const sanitize = require("mongo-sanitize")
const bcrypt = require("bcrypt")

// Student Controller

/**
 * Get all students
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @returns {Promise<void>}
 */

exports.getStudents = async (req, res) => {
  const page = parseInt(sanitize(req.query.page)) || 1
  const limit = parseInt(sanitize(req.query.limit)) || 100
  try {
    // Get all students by skipping and limiting the results
    const getStudents = await Student.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    res.status(201).json({ users: getStudents })
    console.log(`${getStudents.length} Students Found`)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createStudent = async (req, res) => {
  const { name, email, phone, password } = sanitize(req.body)

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    const student = new Student({
      name,
      email,
      phone,
      password: hashedPassword,
    })

    await student.save()
    res.status(201).json({ message: "User registered" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

