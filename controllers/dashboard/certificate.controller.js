const path = require("path")

const generateCertificate = require("../../utils/certificateCard")
const sanitize = require("mongo-sanitize")
const certificateSchema = require("../../schemas/certificateSchema")

exports.certificateController = async (req, res) => {
  try {
    const { error, value } = certificateSchema.validate(req.body)
    if (error) return res.json({ error })

    const data = sanitize(value)

    const {
      name,
      course,
      grade,
      courseDuration,
      certificateId,
      sid,
      regid,
      instructorName,
    } = data

    await generateCertificate(
      name,
      course,
      grade,
      courseDuration,
      certificateId,
      sid,
      regid,
      instructorName
    )

    const filePath = path.join(
      __dirname,
      "../",
      "../",
      "public",
      "generated",
      "cert",
      name.split(" ").join("_") + "-certificate.pdf"
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
