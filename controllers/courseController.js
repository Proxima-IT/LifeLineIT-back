const Course = require("../models/Course")

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesById = async (req, res) => {
  try {
    console.log(req.params.id)
    const course = await Course.findById(req.params.id)
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
