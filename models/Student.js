const mongoose = require("mongoose")
const studentID = require("./id/counter.student")

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sid: {
      type: String,
      unique: true,
      default: null,
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
    totalOrders: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        courseRoute: {
          type: String,
          ref: "Course",
        },
        paid: {
          type: String,
          ref: "Course",
        },
        registrationId: {
          type: String, // 2025/ABC/${sid}
        },
        certificateId: {
          type: String, // 2025-${sid}
        },
        enrolledAt: Date,
        paymentStatus: {
          type: String,
          enum: ["pending", "paid", "failed"],
          default: "pending",
        },
      },
      { _id: false },
    ],
  },
  { timestamps: true }
)

async function getNextSequence(name) {
  const counter = await studentID.findOneAndUpdate(
    { name },
    { $inc: { sid: 1 } },
    { new: true, upsert: true }
  )
  return counter.sid
}

studentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const sid = await getNextSequence("studentID")
    this.sid = `LIT-${sid.toString().padStart(5, "0")}`
  }
  next()
})

module.exports = mongoose.model("Student", studentSchema)
