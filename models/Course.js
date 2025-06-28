const mongoose = require("mongoose")

const instructorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
)

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    route: {
      type: String,
      trim: true,
      index: true,
      unique: true,
    },
    category: {
      type: String,
      trim: true,
    },
    introVideo: {
      type: String,
      trim: true,
    },
    instructors: {
      type: [instructorSchema],
      required: true,
      validate: [(arr) => arr.length > 0, "At least one instructor required"],
    },
    price: {
      type: String,
      trim: true,
      default: "Free",
    },
    startDate: {
      type: String,
      trim: true,
    },
    totalClasses: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Course", courseSchema)
