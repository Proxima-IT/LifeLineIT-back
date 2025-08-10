const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")
const Apply = require("../../models/Apply")
const mongoose = require("mongoose")

const sendSMS = require("@utils/sendMessage")

const getApplyCertificateController = async (req, res) => {
  try {
    const applyCertificate = await Apply.find({}).lean()
    res.status(200).json({ status: true, applyCertificate })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const postApplyController = async (req, res) => {
  const { sid, courseId, driveLink } = sanitize(req.body)

  try {
    // Match from the Apply Database Collection with StudentId and CourseId both, if found then return error

    const findApply = await Apply.findOne({ studentId: sid, courseId }).lean()
    if (findApply)
      return res.json({
        status: false,
        message: "Certificate already applied",
      })

    const applyCertificate = new Apply({
      studentId: sid,
      driveLink: driveLink,
      courseId,
    })
    await applyCertificate.save()
    res
      .status(201)
      .json({ status: true, message: "Certificate applied successfully" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const actionApplyController = async (req, res) => {
  const { applyId, grade } = sanitize(req.body)
  const { action } = sanitize(req.params)

  try {
    const applyData = await Apply.findOne(
      { _id: applyId },
      "studentId courseId"
    ).lean()

    if (!applyData)
      return res.json({ status: false, message: "Apply not found" })

    const { sid, courseId } = applyData
    const courseTitle = await Course.findOne({ _id: courseId }, "title").lean()
    const to = await Student.findOne({ sid }, "phone").lean()

    if (action == "reject") {
      const deleteApply = await Apply.findOneAndDelete({ _id: applyId })

      // ! SENDING MESSAGE
      sendSMS(
        to,
        `Unfortunately, your request for the ${courseTitle} Certificate has been Rejected. Please Reapply or Contact Authority. StudentID: ${sid}`
      )

      res.status(200).json({
        status: deleteApply,
        message: "Certificate rejected",
      })
      return
    }

    const updatedStudent = await Student.updateOne(
      {
        sid: sid,
        "totalOrders.courseId": new mongoose.Types.ObjectId(courseId),
      },
      {
        $set: {
          "totalOrders.$.certificate.canIssue": true,
          "totalOrders.$.certificate.grade": grade,
        },
      }
    )

    const deleteApply = await Apply.findOneAndDelete({ _id: applyId })

    // ! SENDING MESSAGE
    sendSMS(
      to,
      `Congratulations! Your request for the ${courseTitle} Certificate has been Approved. Please download your certificate from your dashboard. StudentID: ${sid}`
    )

    res
      .status(200)
      .json({ status: deleteApply, message: "Certificate Approved" })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  getApplyCertificateController,
  postApplyController,
  actionApplyController,
}
