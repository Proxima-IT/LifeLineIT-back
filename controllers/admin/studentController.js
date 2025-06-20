const Student = require("../../models/Student")
const Course = require("../../models/Course")

// Student Controller
exports.getStudents = async (req, res) => {
  try {
    const getUser = await User.find({})
    console.log(getUser)
    res.status(201).json({ users: getUser })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.createStudent = async (req, res) => {
  const { name, email, phone, password } = req.body

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

// Course Controller

exports.addCourse = async (req, res) => {
  const { title, description, category, instructor, thumbnailUrl } = req.body

  try {
    const Course = await bcrypt.hash(password, 10)
    const course = new Course({
      title,
      description,
      category,
      instructor,
      thumbnailUrl,
    })
    await course.save()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
