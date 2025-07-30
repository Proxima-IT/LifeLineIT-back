const Student = require("@models/Student")
const Course = require("@models/Course")
const sanitize = require("mongo-sanitize")
const bcrypt = require("bcrypt")
const logger = require("@logger")

// Student Controller

/**
 * Get all students
 * @param {Object} req Express Request Object
 * @param {Object} res Express Response Object
 * @returns {Promise<void>}
 */

exports.getStudents = async (req, res) => {
  const page = parseInt(sanitize(req.query.page)) || 1
  const limit = parseInt(sanitize(req.query.limit)) || 50
  try {
    // Get all students by skipping and limiting the results
    const getStudents = await Student.find({})
      .sort({ _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    const totalPages = Math.ceil(totalStudents / limit)

    res.status(201).json({ ...getStudents, totalStudents, totalPages })
    console.log(`${getStudents.length} Students Found`)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.findStudent = async (req, res) => {
  const sid = sanitize(req.params.sid)
  try {
    const student = await Student.findOne({ sid })
    if (student) res.json({ status: true, student })

    res.json({ status: false, message: "User not found" })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: err.message })
  }
}

exports.createStudent = async (req, res) => {
  console.log(req.body)
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

exports.deleteStudent = async (req, res) => {
  const { sid } = sanitize(req.params)
  try {
    const findUser = await Student.findOneAndDelete({ sid })
    console.log(findUser)
    if (!findUser) return res.json({ status: false, message: "User not found" })

    res.json({
      status: true,
      deletedUser: findUser,
    })
  } catch (err) {
    logger.error(err)
    res.status(500).json({ error: err.message })
  }
}

exports.updateStudent = async (req, res) => {
  const data = sanitize(req.body)
  const sid = data.sid
  try {
    if (data.courseAccess) {
      const findStudent = Student.findOne({ sid })
      findStudent.totalOrders.push({
        certificate: {
          canIssue: false,
          grade: "N/A",
        },
        courseId: data.courseId,
        enrolledAt: Date.now(),
        paymentStatus: "paid",
        paid: "0",
        courseRoute: data.courseRoute,
      })
    }

    const updateStudent = await Student.findOneAndUpdate(
      { sid },
      { $set: data },
      { new: true }
    )

    client.del(`student:${data.id}`)

    return updateStudent
      ? res
          .status(200)
          .json({ status: true, message: "Updated Student successfully" })
      : res
          .status(404)
          .json({ status: false, error: "Updated Student not found" })
  } catch (err) {
    res.status(500).json({ error: err.message })
    logger.error(err)
  }
}
