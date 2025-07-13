const generateCertificate = require("../../utils/certificateTemplate")
const sanitize = require("mongo-sanitize")
// MongoDB Models
const Certificate = require("../../models/Certificate")
const Course = require("../../models/Course")
const client = require("../../utils/redisClient")
const Student = require("../../models/Student")

exports.certificateController = async (req, res) => {
  try {
    const { studentId, courseId } = sanitize(req.body)

    const CACHE_DATA = `student:${studentId}`
    console.log("Cache Key:", CACHE_DATA)
    const cachedData = await client.get(CACHE_DATA)

    let studentData
    if (!cachedData) {
      studentData = await Student.findOne({ _id: studentId })
    } else {
      studentData = JSON.parse(cachedData)
    }

    const { name, sid, totalOrders } = studentData

    const findCourse = await Course.findOne({
      _id: courseId,
    })

    const { title, duration, instructors } = findCourse

    const matchedCourse = totalOrders.find(
      (order) => order.courseId.toString() === courseId.toString()
    )

    const courseCode = title
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .substring(0, 3)
      .toUpperCase()

    const courseYear = new Date(matchedCourse.enrolledAt)
      .getFullYear()
      .toString()

    // 2025-ABC${sid}
    const certificateId = `${courseYear}-${courseCode.toUpperCase()}${
      sid.split("-")[1]
    }`
    // 2025/ABC/${sid}
    const regId = `${courseYear}/${courseCode.toUpperCase()}/${
      sid.split("-")[1]
    }`

    // Checking if the issue date is already issued
    const existingCertificate = await Certificate.findOne({
      studentId,
      courseId,
    })

    let issueDate
    if (existingCertificate) {
      issueDate = new Date(existingCertificate.issueDate)
    } else {
      issueDate = new Date()
      const certificate = new Certificate({
        studentId,
        courseId,
        certificateId,
        regId,
        issueDate,
        grade: matchedCourse.certificate.grade,
      })

      await certificate.save()
    }

    console.log("Grade", matchedCourse.certificate.grade)

    const pdfBuffer = await generateCertificate(
      name,
      title.split(" ").slice(0, 3).join(" ") /* Course's Title */,
      matchedCourse.certificate.grade /* student's grade */,
      duration /*courseDuration*/,
      issueDate /* issueDate */,
      certificateId,
      sid,
      regId,
      instructors[0].name,
      instructors[0].sign
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
    return res.json({ error })
  }
}
