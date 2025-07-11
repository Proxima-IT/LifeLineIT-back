const path = require("path")

const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")

const generateRegistrationPDF = require("../../utils/registrationTemplate")
const Course = require("../../models/Course")
const getSession = require("../../utils/sessionGen")

exports.registrationController = async (req, res) => {
  try {
    const { email, courseId } = sanitize(req.body)

    console.log(email, courseId)

    const findStudent = await Student.findOne({ email })

    const matchedCourse = findStudent.totalOrders.find(
      (order) => order.courseId.toString() === courseId.toString()
    )

    const findCourse = await Course.findOne({ _id: courseId }, { duration: 1 })
    const courseDuration = findCourse ? findCourse.duration : "Unknown"

    const { registrationId, enrolledAt } = matchedCourse
    const courseSession = getSession(
      enrolledAt,
      Number(courseDuration.split(" ")[0])
    )

    const { name, image, father, mother, gender, phone, dateOfBirth, sid } =
      findStudent

    console.log("Image URL:", image)
    /* name,
      father,
      mother,
      gender,
      birthday,
      number,
      registration,
      sid, */

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
    return res.json({ error })
  }
}
