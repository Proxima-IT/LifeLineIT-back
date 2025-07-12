const generateCertificate = require("../../utils/certificateTemplate")
const sanitize = require("mongo-sanitize")
// MongoDB Models
const Certificate = require("../../models/Certificate")
const Course = require("../../models/Course")

exports.certificateController = async (req, res) => {
  try {
    const { studentId, courseId } = sanitize(req.body)

    const CACHE_DATA = `student:${studentId}`
    const cachedData = await client.get(CACHE_DATA)

    const studentData = JSON.parse(cachedData)

    const { name, sid, totalOrders } = studentData

    const findCourse = await Course.findOne({
      _id: courseId,
    })

    const { title, duration, instructors } = findCourse

    const matchedCourse = totalOrders.find(
      (order) => order.courseId.toString() === courseId.toString()
    )

    const courseCode = title.slice(0, 3)
    const courseYear = matchedCourse.enrolledAt.toString().split(" ")[3]

    // 2025-ABC${sid}
    const certificateId = `${courseYear}-${courseCode.toUpperCase()}${
      sid.split("-")[1]
    }`
    // 2025/ABC/${sid}
    const regId = `${courseYear}/${courseCode.toUpperCase()}/${
      sid.split("-")[1]
    }`

    console.log(certificateId, regId)

    const certificate = new Certificate({
      studentId,
      courseId,
      certificateId,
      regId,
    })

    await certificate.save()

    const pdfBuffer = await generateCertificate(
      name,
      title /* Course's Title */,
      matchedCourse.certificate.grade /* student's grade */,
      duration /*courseDuration*/,
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
