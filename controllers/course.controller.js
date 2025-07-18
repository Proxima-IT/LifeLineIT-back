const Course = require("../models/Course")
const sanitize = require("mongo-sanitize")
const client = require("../utils/redisClient")

exports.getCourses = async (req, res) => {
  try {
    // If data is already cached in redis, return it
    const CACHE_KEY = "courses:all"
    const cachedCourses = await client.get(CACHE_KEY)

    if (cachedCourses) {
      return res.status(200).json(JSON.parse(cachedCourses))
    }

    // If not, find it from the database

    const courses = await Course.find({}).sort({ _id: -1 }).lean()

    await client.set(CACHE_KEY, JSON.stringify(courses), { EX: 60 })
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
      return res.status(200).json(JSON.parse(cachedCourses))
    }

    // If not, find it from the database
    const course = await Course.findOne({ route: paramName }).lean()

    if (!course) {
      return res
        .status(404)
        .json({ error: `No courses found in ${paramName} route` })
    }

    await client.set(CACHE_KEY, JSON.stringify(course), { EX: 60 })

    return res.json(course)
  } catch (err) {
    console.log(err)
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
        .sort({ _id: -1 })
        .limit(req.query.limit)
        .lean()
      await client.set(CACHE_KEY, JSON.stringify(course), { EX: 60 })
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
  const data = sanitize(req.body)
  if (data.instructors && typeof data.instructors === "string") {
    data.instructors = JSON.parse(data.instructors)
  }
  data.route = data.route.split(" ").join("-")

  try {
    const course = new Course(data)
    await course.save()
    res.status(200).json({ message: "Success" })

    redisClient.del("courses:all")
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}

exports.updateCourse = async (req, res) => {
  const data = sanitize(req.body)
  data.route = data.route.split(" ").join("-")

  try {
    const findCourse = await Course.findOneAndUpdate(
      { route: data.route },
      { $set: data },
      { new: true }
    )

    redisClient.del("courses:all")

    return findCourse
      ? res
          .status(200)
          .json({ status: true, message: "Course updated successfully" })
      : res.status(404).json({ status: false, error: "Course not found" })
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}

exports.deleteCourse = async (req, res) => {
  const data = sanitize(req.param)

  try {
    const findCourse = await Course.findOneAndDelete({ route: data.id })
    redisClient.del("courses:all")

    return findCourse
      ? res
          .status(200)
          .json({ status: true, message: "Course deleted successfully" })
      : res.status(404).json({ status: true, error: "Course not found" })
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}
