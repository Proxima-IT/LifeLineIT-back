const { createPayment, executePayment } = require("../../utils/bkash")

const paymentBkash = async (req, res) => {
  const { amount } = req.body

  const invoiceId = Date.now().toString()
  if (!amount || !invoiceId) {
    return res.status(400).json({ error: "amount and invoiceId required" })
  }

  try {
    const payment = await createPayment(amount, invoiceId)

    return res.status(200).json({
      bkashURL: payment.bkashURL,
      paymentID: payment.paymentID,
      statusMessage: payment.statusMessage,
    })
  } catch (err) {
    console.error("❌ Payment error:", err.message)
    return res.status(500).json({ error: "bKash Payment Failed" })
  }
}

const callbackBkash = async (req, res) => {
  const { paymentID, status } = req.query

  console.log("Callback hit with:", req.query)

  if (status === "success") {
    try {
      const result = await executePayment(paymentID)
      console.log("✅ Payment executed:", result)

      res.send("✅ Payment completed successfully!")
    } catch (err) {
      console.error("❌ Execution failed:", err.message)
      res.send("⚠️ " + err.message)
    }
  } else {
    res.send("❌ Payment failed or canceled.")
  }
}

module.exports = { paymentBkash, callbackBkash }
