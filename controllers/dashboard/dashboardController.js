const Student = require("../../models/Student")
const { Types } = require("mongoose")

exports.dashboardController = async (req, res) => {
  const findStudent = await Student.findOne({ _id: req.user.id })
  const {
    name,
    email,
    phone,
    password,
    role,
    registrationCardIssued,
    totalCourses,
    certificates,
  } = findStudent

  const filteredCourses = await Student.aggregate([
    {
      $match: { _id: new Types.ObjectId(req.user.id) },
    },
    {
      $project: {
        _id: 0,
        approvedCourses: {
          $filter: {
            input: "$totalCourses",
            as: "course",
            cond: { $eq: ["$$course.paymentStatus", "paid"] },
          },
        },
        pendingCourses: {
          $filter: {
            input: "$totalCourses",
            as: "course",
            cond: { $eq: ["$$course.paymentStatus", "pending"] },
          },
        },
      },
    },
  ])

  const courseStatus = filteredCourses[0] || {
    approvedCourses: [],
    pendingCourses: [],
  }

  res.json({
    name,
    email,
    phone,
    role,
    registrationCardIssued,
    totalCourses,
    courseStatus,
    certificates,
  })
}
