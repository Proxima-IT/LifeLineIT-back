// bkash.js
require("dotenv").process.env.bKash_()

const axios = require("axios")
const process.env.bKash_ = require("./bkashprocess.env.bKash_")

async function getToken() {
  try {
    const url = `${process.env.bKash_baseURL}/tokenized/checkout/token/grant`
    const headers = {
      "Content-Type": "application/json",
      username: process.env.bKash_username,
      password: process.env.bKash_password,
    }

    const body = {
      app_key: process.env.bKash_app_key,
      app_secret: process.env.bKash_app_secret,
    }

    const response = await axios.post(url, body, { headers })

    return response.data.id_token
  } catch (err) {
    console.error("❌ Error getting token:", err.response?.data || err.message)
    throw new Error("Token generation failed")
  }
}

async function createPayment(amount, invoiceId) {
  const id_token = await getToken()

  const url = `${process.env.bKash_baseURL}/tokenized/checkout/create`
  const headers = {
    "Content-Type": "application/json",
    // Authorization: id_token,
    Authorization: `Bearer ${id_token}`,
    "x-app-key": process.env.bKash_app_key,
  }

  const body = {
    mode: "0011",
    payerReference: "01770618575",
    callbackURL: process.env.bKash_callbackURL,
    amount: amount.toString(),
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: invoiceId,
  }

  try {
    const response = await axios.post(url, body, { headers })
    // console.log("RESPONSE: ", response.data)
    return response.data
  } catch (err) {
    console.error(
      "❌ Error creating payment:",
      err.response?.data || err.message
    )
    throw new Error("Payment creation failed")
  }
}

async function executePayment(paymentID) {
  const id_token = await getToken()

  // console.log("ID TOKEN", id_token)

  const url = `${process.env.bKash_baseURL}/tokenized/checkout/execute`
  const headers = {
    "Content-Type": "application/json",
    authorization: id_token,
    "x-app-key": process.env.bKash_app_key,
  }

  const body = {
    paymentID,
  }

  try {
    const response = await axios.post(url, body, { headers })
    console.log("ExecutePayment Response:", response.data)
    if (response.data && response.data.statusCode !== "0000") {
      throw new Error("Execution failed: " + response.data.statusMessage)
    }
    return response.data
  } catch (err) {
    console.log(
      "❌ Error executing payment:",
      err.response?.data || err.message
    )
    throw new Error("Payment execution failed")
  }
}

module.exports = {
  createPayment,
  executePayment,
}
