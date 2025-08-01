const mongoose = require("mongoose")

const generalSchema = new mongoose.Schema({
  bannerImage: {
    type: String,
    trim: true,
  },
  studentInfo: {
    totalStudents: {
      type: String,
    },
    successCount: {
      type: String,
    },
    courseCompletors: {
      type: String,
    },
  },

  contactInfo: {
    type: [
      {
        time: {
          type: String,
          trim: true,
        },
        number: {
          type: String,
          trim: true,
        },
      },
    ],
  },
})

module.exports = mongoose.model("General", generalSchema)
