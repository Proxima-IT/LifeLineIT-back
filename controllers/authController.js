const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// Importing Models - MongoDB SChemas(otpSchema)
const Student = require("../models/Student")
const Otp = require("../models/Otp")

// Importing Email Sender
const sendEmail = require("../utils/sendEmail")

// 1. OTP Verification
exports.otpVerification = async (req, res) => {
  const { email } = req.body
  console.log(email)

  const existingStudent = await Student.findOne({ email })

  console.log("Existing Student:", existingStudent)
  if (existingStudent)
    return res.status(400).json({ message: "Student already exists" })

  try {
    const otpGenerator = require("otp-generator")
    const generatedOtpCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })

    sendEmail(
      email,
      "OTP Code - ProximaIT",
      `Your OTP code is ${generatedOtpCode}`
    )

    console.log("Email Send! OTP Code:", generatedOtpCode)

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
    console.log(err)
  }
}

// 2. Registering Account with Confirmation

exports.register = async (req, res) => {
  const { name, email, phone, password, otp } = req.body

  let takenOtpCode = otp
  const getOtp = await Otp.findOne({ email })
  if (!getOtp) {
    return res.status(400).json({ message: "OTP not found, deleted." })
  }

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
      res.status(201).json({ message: "Student registered" })
    } else {
      res.status(201).json({ message: "OTP didn't matched" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
    console.log(err)
  }
}

// 3. Login

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const student = await Student.findOne({ email })

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(401).json({ message: "Invalid credentials" })
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
      // secure: process.env.NODE_ENV === "production",
      sameSite: "Strict", // or "Lax" or "None" (with Secure)
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
    })
    res.json({ message: "Successfully Logged In!", token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
