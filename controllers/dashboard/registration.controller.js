const sanitize = require("mongo-sanitize")
const Student = require("@models/Student")
const Course = require("@models/Course")

const generateRegistrationPDF = require("@utils/registrationTemplate")
const getSession = require("@utils/sessionGen")
const client = require("@utils/redisClient")
const logger = require("@logger")
const { default: mongoose } = require("mongoose")

exports.registrationController = async (req, res) => {
  try {
    const { studentId, courseId } = sanitize(req.body)

    const CACHE_DATA = `student:${studentId}`
    const cachedData = await client.get(CACHE_DATA)

    console.log(cachedData)
    let studentData

    if (cachedData) {
      studentData = JSON.parse(cachedData)
    } else {
      const query = mongoose.Types.ObjectId.isValid(studentId)
        ? { $or: [{ _id: studentId }, { sid: studentId }] }
        : { sid: studentId }

      studentData = await Student.findOne(query)
    }

    const {
      name,
      image,
      father,
      mother,
      gender,
      phone,
      dateOfBirth,
      sid,
      totalOrders,
    } = studentData

    let matchedCourse
    if (mongoose.Types.ObjectId.isValid(studentId)) {
      matchedCourse = totalOrders.find(
        (order) => order.courseId.toString() === courseId.toString()
      )
    } else {
      matchedCourse = {
        enrolledAt: new Date().getFullYear().toString(),
      }
    }

    const { enrolledAt } = matchedCourse

    const query = mongoose.Types.ObjectId.isValid(studentId)
      ? { $or: [{ _id: courseId }, { route: courseId }] }
      : { route: courseId }

    const findCourse = await Course.findOne(query)

    const courseCode = findCourse.title
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()

    const courseYear = new Date(matchedCourse.enrolledAt)
      .getFullYear()
      .toString()

    const registrationId = `${courseYear}/${courseCode}/${sid.split("-")[1]}`

    const courseDuration = findCourse ? findCourse.duration : "Unknown"

    const courseSession = getSession(
      enrolledAt,
      Number(courseDuration.split(" ")[0])
    )

    const pdfBuffer = await generateRegistrationPDF(
      image,
      name,
      father,
      mother,
      gender,
      dateOfBirth,
      phone,
      registrationId,
      sid,
      courseSession
    )

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${name
        .split(" ")
        .join("_")}-registration-card.pdf`,
      "Content-Length": pdfBuffer.length,
    })

    res.end(pdfBuffer)
  } catch (error) {
    console.log(error)
    logger.error(error)
    return res.json({ error })
  }
}
