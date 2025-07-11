const path = require("path")

const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")

const generateRegistrationPDF = require("../../utils/registrationTemplate")

exports.registrationController = async (req, res) => {
  try {
    const { email, courseId } = sanitize(req.body)

    console.log(email, courseId)

    const findStudent = await Student.findOne({ email })

    const matchedCourse = findStudent.totalOrders.find(
      (order) => order.courseId.toString() === courseId.toString()
    )

    const { registrationId } = matchedCourse

    const { name, father, mother, gender, phone, dateOfBirth, sid } =
      findStudent

    console.log(
      name,
      father,
      mother,
      gender,
      phone,
      dateOfBirth,
      registrationId,
      sid
    )
    /* name,
      father,
      mother,
      gender,
      birthday,
      number,
      registration,
      sid, */
      
    const pdfBuffer = await generateRegistrationPDF(
      name,
      father,
      mother,
      gender,
      dateOfBirth,
      phone,
      registrationId,
      sid
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
