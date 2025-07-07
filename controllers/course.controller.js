const Course = require("../models/Course")
const sanitize = require("mongo-sanitize")
const client = require("../utils/redisClient")

exports.getCourses = async (req, res) => {
  try {
    // If data is already cached in redis, return it
    const CACHE_KEY = "courses:all"
    const cachedCourses = await client.get(CACHE_KEY)

    if (cachedCourses) {
      return res.json(JSON.parse(cachedCourses))
    }

    // If not, find it from the database

    const courses = await Course.find({}).lean()

    await client.set(CACHE_KEY, JSON.stringify(courses), { EX: 3600 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getCoursesByName = async (req, res) => {
  try {
    const paramName = sanitize(req.params.name).split(" ").join("-")
    const CACHE_KEY = `courses:${paramName}`
    const cachedCourses = await client.get(CACHE_KEY)

    if (cachedCourses) {
      return res.json(JSON.parse(cachedCourses))
    }

    // If not, find it from the database
    const course = await Course.findOne({ route: paramName }).lean()
    await client.set(CACHE_KEY, JSON.stringify(course), { EX: 3600 })

    return res.json(course)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// gets reqs from client side's -> "/"
exports.getCoursesBySearch = async (req, res) => {
  try {
    const CACHE_KEY = `search:${
      req.query.name + (!req.query.limit ? "" : req.query.limit)
    }`

    const cachedCourses = await client.get(CACHE_KEY)
    if (cachedCourses) {
      return res.json(JSON.parse(cachedCourses))
    }

    if (req.query.limit && req.query.name) {
      const course = await Course.find({ type: req.query.name })
        .limit(req.query.limit)
        .lean()
      await client.set(CACHE_KEY, JSON.stringify(course), { EX: 3600 })
      return res.json(course)
    }

    const searchQuery = sanitize(req.query.name).split(" ").join("-")
    const course = await Course.find({
      $or: [
        { route: { $regex: searchQuery, $options: "i" } },
        { type: { $regex: searchQuery, $options: "i" } },
      ],
    }).lean()

    res.json(course)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}

// ADMIN CONTROLLERS
// Course Controller

exports.addCourse = async (req, res) => {
  if (req.body.instructors && typeof req.body.instructors === "string") {
    req.body.instructors = JSON.parse(req.body.instructors)
  }
  req.body.route = req.body.route.split(" ").join("-")

  try {
    console.log(req.body)
    const course = new Course(req.body)
    await course.save()
    res.status(200).json({ message: "Success" })
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}
