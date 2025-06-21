const nodemailer = require("nodemailer")

async function sendEmail(email, subject, text) {
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
    subject: subject || "ProximaIT Email",
    text: text,
  }

  await transporter.sendMail(mailOptions)
}

module.exports = sendEmail
