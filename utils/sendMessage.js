const axios = require("axios")
const logger = require("@logger")

const API_KEY = "MV1PqrLgksMTX4aFkvEB"
const SENDER_ID = "8809617627184"
const SMS_URL = "http://bulksmsbd.net/api/smsapi"

async function sendSMS(to, message) {
  try {
    const response = await axios.post(SMS_URL, null, {
      params: {
        api_key: API_KEY,
        senderid: SENDER_ID,
        number: to,
        message: message,
      },
    })

    logger.info("SMS Sent! Response:", response.data)
  } catch (error) {
    logger.error("Error sending SMS:", error.response?.data || error.message)
  }
}

module.exports = sendSMS
