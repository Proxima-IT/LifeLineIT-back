const Course = require("../models/Course")
const sanitize = require("mongo-sanitize")

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find(
      {},
      {
        title: 1,
        subtitle: 1,
        description: 1,
        route: 1,
        duration: 1,
        type: 1,
        category: 1,
        thumbnail: 1,
      }
    ).lean()
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesByName = async (req, res) => {
  try {
    const paramName = sanitize(req.params.name).split(" ").join("-")
    const course = await Course.findOne({ route: paramName }).lean()
    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesBySearch = async (req, res) => {
  try {
    // console.log("Query data", req.query)
    if (req.query.limit && req.query.type) {
      const course = await Course.find({ type: req.query.type })
        .limit(req.query.limit)
        .lean()
      return res.json(course)
    }
    const searchQuery = sanitize(req.query.name).split(" ").join("-")
    // console.log(searchQuery)
    const course = await Course.find({
      $or: [
        { route: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean()

    res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
