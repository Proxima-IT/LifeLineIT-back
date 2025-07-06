const Student = require("../../models/Student")
const Course = require("../../models/Course")
const sanitize = require("mongo-sanitize")
const bcrypt = require("bcrypt")

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

// Reset Student Data (Rename, Forgot Password etc.)
exports.resetStudent = async (req, res) => {
  try {
    const rawBody = sanitize(req.body)
    const allowedFields = ["name", "email", "password"]
    const updateFields = {}

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(rawBody, key)) {
        updateFields[key] = rawBody[key]
      }
    }

    console.log(updateFields)
    if (Object.prototype.hasOwnProperty.call(updateFields, "password")) {
      updateFields.password = await bcrypt.hash(updateFields.password, 10)
    }

    await Student.updateOne({ _id: req.user.id }, { $set: updateFields })
    // Clearing the previous cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    })
    return res.json({ success: true })
  } catch (error) {
    return res.json({ error })
  }
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
