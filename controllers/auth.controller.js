const fs = require("fs").promises
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
// Validation and Sanitization
const studentSchema = require("../schemas/studentSchema")
const sanitize = require("mongo-sanitize")

// Importing Models - MongoDB SChemas(otpSchema)
const Student = require("../models/Student")
const Otp = require("../models/Otp")

// Importing Email Sender
const sendEmail = require("../utils/sendEmail")

// 1. OTP Verification
exports.otpVerification = async (req, res) => {
  try {
    const { email } = sanitize(req.body)
    const existingStudent = await Student.findOne({ email }).lean()

    console.log("Existing Student:", existingStudent)
    if (existingStudent)
      return res
        .status(400)
        .json({ status: false, message: "Student already exists" })

    const otpGenerator = require("otp-generator")
    const generatedOtpCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })

    const rootDir = path.resolve(__dirname, "../")
    let otpHtmlContent = await fs.readFile(
      path.join(rootDir, "utils", "templates", "email", "otpMail.html"),
      "utf8"
    )

    otpHtmlContent = otpHtmlContent.replace("000000", generatedOtpCode)

    if (email && otpHtmlContent)
      sendEmail(email, "OTP Code - ProximaIT", otpHtmlContent)

    // Storing OTP into database.
    const existingOtp = await Otp.findOne({ email })
    if (existingOtp) {
      // If OTP already exists, update it
      existingOtp.otp = generatedOtpCode
      await existingOtp.save()
    } else {
      // If OTP does not exist, create a new one
      const otp = new Otp({ email, otp: generatedOtpCode })
      await otp.save()
    }

    res.status(200).json({ message: `OTP Sent to ${email}` })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// 2. Registering Account with Confirmation

exports.registerController = async (req, res) => {
  const { error, value } = studentSchema.validate(sanitize(req.body), {
    stripUnknown: true,
  })
  console.log("Validation Result:", error, value)
  const { name, email, phone, password, otp } = value

  if (error) {
    return res
      .status(400)
      .json({ status: false, message: error.details[0].message })
  }

  let takenOtpCode = otp
  const getOtp = await Otp.findOne({ email })
  if (!getOtp) {
    return res
      .status(400)
      .json({ status: false, message: "OTP not found, deleted." })
  }

  console.log("takenOtpCode:", takenOtpCode)
  const generatedOtpCode = getOtp.otp
  try {
    if (generatedOtpCode == takenOtpCode) {
      const hashedPassword = await bcrypt.hash(password, 10)

      const student = new Student({
        name,
        email,
        phone,
        password: hashedPassword,
      })

      await student.save()
      res.status(201).json({
        status: true,
        message: "Student has been successfully registered!",
      })
    } else {
      res.status(201).json({ status: false, message: "OTP didn't matched" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}

// 3. Login

exports.loginController = async (req, res) => {
  const { email, password } = sanitize(req.body)
  try {
    const student = await Student.findOne({ email })
      .select("name email role password")
      .lean()

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({
        message: "Invalid credentials, Please cross-check your inputs.",
      })
    }

    const token = jwt.sign(
      {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
      },
      process.env.JWT_SECRET
    )

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      // domain:
      //   process.env.NODE_ENV === "production" ? ".lifelineit.com" : undefined,
      maxAge: 86400000,
      path: "/",
    })

    res.json({
      success: true,
      name: student.name,
      message: "Successfully Logged In!",
      token,
    })
  } catch (err) {
    console.error("Login Error:", err)
    res.status(500).json({ error: err.message })
  }
}

exports.logoutController = (req, res) => {
  res.clearCookie("token")
  return res
    .status(200)
    .json({ logout: true, message: "Logged out successfully" })
}
