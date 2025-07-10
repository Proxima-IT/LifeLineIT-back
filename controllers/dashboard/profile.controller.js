const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")

const resetInfo = async (req, res) => {
  try {
    const rawBody = sanitize(req.body)
    const allowedFields = ["name", "phone", "currentpass", "newpass"]
    const updateFields = {}

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(rawBody, key)) {
        updateFields[key] = rawBody[key]
      }
    }

    console.log(updateFields)

    if (Object.prototype.hasOwnProperty.call(updateFields, "newpass")) {
      const { email } = req.user
      const findStudent = await Student.findOne(email)

      const hashedPassword = findStudent.password
      const currentPassword = updateFields.currentpass
      const isMatch = await bcrypt.compare(currentPassword, hashedPassword)

      if (findStudent && isMatch) {
        updateFields.password = await bcrypt.hash(updateFields.newpass, 10)
      }
    }

    await Student.updateOne({ _id: req.user.id }, { $set: updateFields })

    // Clearing the previous cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    })
    return res.json({ success: true })
  } catch (error) {
    return res.json({ error })
  }
}

module.exports = resetInfo
