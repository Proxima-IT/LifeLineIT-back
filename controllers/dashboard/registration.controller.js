const path = require("path")

const generateRegistrationPDF = require("../../utils/registrationcard")
const sanitize = require("mongo-sanitize")
const registrationCardSchema = require("../../schemas/registrationSchema")

exports.registrationController = async (req, res) => { 
  try {
    const { error, value } = registrationCardSchema.validate(req.body)
    if (error) return res.json({ error })

    const data = sanitize(value)
    const {
      name,
      father,
      mother,
      gender,
      birthday,
      number,
      registration,
      sid,
    } = data

    await generateRegistrationPDF(
      name,
      father,
      mother,
      gender,
      birthday,
      number,
      registration,
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
