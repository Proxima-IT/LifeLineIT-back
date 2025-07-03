const Student = require("../../models/Student")
const Course = require("../../models/Course")
const sanitize = require("mongo-sanitize")

// Student Controller
exports.getStudents = async (req, res) => {
  const page = parseInt(sanitize(req.query.page)) || 1
  const limit = parseInt(sanitize(req.query.limit)) || 100
  try {
    const getStudents = await Student.find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
    res.status(201).json({ users: getStudents })
    console.log(getStudents.length + " Students Found")
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

// Update Students
exports.updateStudent = async (req, res) => {
  const { id } = sanitize(req.params)
  const bodyData = sanitize(req.body)
  const updateFields = {}

  for (const key of allowedFields) {
    if (req.body.hasOwnProperty(key)) {
      updateFields[key] = bodyData[key]
    }
  }

  await Student.updateOne({ id }, { $set: updateFields })
}

// Delete Student

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params
    const deletedStudent = await Student.findByIdAndDelete(id)

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
