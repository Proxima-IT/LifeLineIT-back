const Student = require("../../models/Student")
const Course = require("../../models/Course")

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
