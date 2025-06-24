const sendEmail = require("../../utils/sendEmail")
const sanitize = require("mongo-sanitize")

exports.addPayment = async (req, res) => {
  const Payment = require("../../models/Payment")
  const sendEmail = require("../../utils/sendEmail")
  const { accountNumber, amount } = req.body
  const { name, email } = req.user

  try {
    const payment = new Payment({
      name,
      email,
      accountNumber,
      amount,
    })
    await payment.save()
    res.status(201).json({ message: "Payment added successfully", payment })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.getPayements = async (req, res) => {
  const Payment = require("../../models/Payment")
  try {
    const getPayments = await Payment.find({})
    res.status(201).json({ payemnts: getPayments })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

exports.updatePayment = async (req, res) => {
  const { status } = sanitize(req.body)
  const Payment = require("../../models/Payment")
  const getPayment = await Payment.findById(req.params.id)
  const { name, email } = getPayment

  try {
    await Payment.deleteOne({ _id: req.params.id })

    let mailMessage = ``
    if (status == "approved") {
      mailMessage = `Congratulations ${name}! your payment has been approved. Please check your account for details.`
    } else {
      mailMessage = `Sorry ${name}, your payment was declined. Please contact facebook page for further details.`
    }
    sendEmail(email, "Payment Declined - ProximaIT", mailMessage)
    res.status(201).json({ message: `Payment ${status} successfully` })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message })
  }
}
