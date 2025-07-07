const mongoose = require("mongoose")

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    trim: true,
  },
})

module.exports = mongoose.model("Notice", noticeSchema)
