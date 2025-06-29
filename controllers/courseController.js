const Course = require("../models/Course")
const sanitize = require("mongo-sanitize")

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesByName = async (req, res) => {
  try {
    console.log(req.params.name)
    const paramName = sanitize(req.params.name).split(" ").join("-")
    console.log(paramName)
    const course = await Course.find({ route: paramName })
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesBySearch = async (req, res) => {
  try {
    const searchQuery = sanitize(req.query.search).split(" ").join("-")
    console.log(searchQuery)
    // I want to find from both route and title

    const course = await Course.find({
      $or: [
        { route: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
        { title: { $regex: searchQuery, $options: "i" } },
      ],
    })

    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
