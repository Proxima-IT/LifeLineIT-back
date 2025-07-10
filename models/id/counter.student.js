const mongoose = require("mongoose")

const studentCounterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sid: { type: Number, default: 0 },
})

module.exports = mongoose.model("StudentCounter", studentCounterSchema)
