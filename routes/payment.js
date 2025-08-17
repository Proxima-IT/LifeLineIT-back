const express = require("express")
const router = express.Router()

const {
  paymentController,
  callbackBkash,
} = require("@controllers/payment.controller")

// ROOT: /api/payment
router.post("/pay", paymentController)
router.get("/callback", callbackBkash)
