const sanitize = require("mongo-sanitize")
const Student = require("../../models/Student")
const Apply = require("../../models/Apply")
const mongoose = require("mongoose")

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
  const { applyId } = sanitize(req.body)
  const { action } = sanitize(req.params)

  try {
    if (action == "reject") {
      const deleteApply = await Apply.findOneAndDelete({ _id: applyId })

      res.status(200).json({
        status: deleteApply,
        message: "Certificate rejected",
      })
      return
    }

    const applyData = await Apply.findOne(
      { _id: applyId },
      "studentId courseId"
    ).lean()

    if (!applyData)
      return res.json({ status: false, message: "Apply not found" })

    const { sid, courseId } = applyData

    const updatedStudent = await Student.updateOne(
      {
        sid: sid,
        "totalOrders.courseId": new mongoose.Types.ObjectId(courseId),
      },
      { $set: { "totalOrders.$.certificate.canIssue": true } }
    )

    if (updatedStudent.modifiedCount == 0)
      return res.json({ status: false, message: "Something went wrong" })

    const deleteApply = await Apply.findOneAndDelete({ _id: applyId })

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
