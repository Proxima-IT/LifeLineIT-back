const Course = require("../../models/Course")

// Course Controller

exports.addCourse = async (req, res) => {
  if (req.body.instructors && typeof req.body.instructors === "string") {
    req.body.instructors = JSON.parse(req.body.instructors)
  }

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
