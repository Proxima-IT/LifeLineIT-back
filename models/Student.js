const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    totalCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        route: {
          type: String,
          ref: "Course",
        },
        price: {
          type: String,
          ref: "Course",
        },
        enrolledAt: Date,
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
      },
    ],
    certificates: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        certificateId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Certificate",
        },
        issued: {
          type: Boolean,
          default: false,
        },
      },
    ],
    registrationCardIssued: {
      type: Boolean,
      default: false,
    },

  },
  { timestamps: true }
)

module.exports = mongoose.model("Student", studentSchema)
