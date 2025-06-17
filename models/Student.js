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
      unique: true,
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
    profileImage: {
      type: String,
    },
    enrolledCourses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
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
    // address: String,
    // gender: String,
    // dateOfBirth: Date,
    // timestamps will automatically add createdAt and updatedAt
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", studentSchema)
