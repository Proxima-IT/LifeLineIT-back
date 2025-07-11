const path = require("path")

const generateRegistrationPDF = require("../../utils/registrationCard")
const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")

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
    await generateRegistrationPDF(
      name,
      father,
      mother,
      gender,
      dateOfBirth,
      phone,
      registrationId,
      sid
    )

    const filePath = path.join(
      __dirname,
      "../",
      "../",
      "public",
      "generated",
      "reg",
      name.split(" ").join("_") + "-registration-card.pdf"
    )

    res.download(filePath, (err) => {
      if (err) {
        console.error("Download error:", err)
        res.status(404).send("File not found")
      }
    })
  } catch (error) {
    console.log(error)
    return res.json({ error })
  }
}
