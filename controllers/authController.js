const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

// Importing Models - MongoDB SChemas(otpSchema)
const Student = require("../models/Student")
const Otp = require("../models/Otp")

// 1. OTP Verification

exports.otpVerification = async (req, res) => {
  const { email } = req.body
  const existingStudent = await Student.findOne({ email })
  if (existingStudent)
    return res.status(400).json({ message: "Student already exists" })

  try {
    // Generating OTP
    const otpGenerator = require("otp-generator")
    const generatedOtpCode = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    })

    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD, // Use "app password", NOT Gmail login password
      },
    })

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "OTP Code - ProximaIT",
      text: `Your OTP code is ${generatedOtpCode}`,
    }

    await transporter.sendMail(mailOptions)

    // Storing OTP into database.
    const otp = new Otp({ email, otp: generatedOtpCode })
    await otp.save()

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
  const generatedOtpCode = getOtp.otp

  try {
    if (generatedOtpCode == takenOtpCode) {
      const hashedPassword = await bcrypt.hash(password, 10)
      const Student = new Student({
        name,
        email,
        phone,
        password: hashedPassword,
      })
      await Student.save()

      res.status(201).json({ message: "Student registered" })
    } else {
      res.status(201).json({ message: "OTP didn't matched" })
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// 3. Login

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const Student = await Student.findOne({ email })

    if (!Student || !(await bcrypt.compare(password, Student.password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign(
      { id: Student._id, role: Student.role },
      process.env.JWT_SECRET
    )
    res.json({ message: "Successfully Logged In!", token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
