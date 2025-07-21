const mongoose = require("mongoose")

const generalSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    trim: true,
  },
  totalStudents: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model("General", generalSchema)
