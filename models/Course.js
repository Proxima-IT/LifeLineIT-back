const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: String,
    instructor: String,
    thumbnail: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)
