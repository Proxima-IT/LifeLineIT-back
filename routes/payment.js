const express = require("express")
const router = express.Router()
const { verifyJWT } = require("../middlewares/authMiddleware")
const {
  addPayment,
  getPayements,
  updatePayment,
} = require("../controllers/admin/paymentController")

// ROOT: /api/payment
router.get("/", getPayements) // GET
router.post("/", verifyJWT, addPayment) // POST
router.post("/:id", updatePayment) // DELETE (Check the payment and approve/decline it))
module.exports = router
