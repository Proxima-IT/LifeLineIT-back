const Student = require("../../models/Student")
const { Types } = require("mongoose")

exports.dashboardController = async (req, res) => {
  const findStudent = await Student.findOne({ _id: req.user.id })
  const {
    name,
    email,
    phone,
    role,
    registrationCardIssued,
    totalOrders,
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
            input: "$totalOrders",
            as: "course",
            cond: { $eq: ["$$course.paymentStatus", "paid"] },
          },
        },
        pendingCourses: {
          $filter: {
            input: "$totalOrders",
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

  const totalPaid = courseStatus.approvedCourses?.reduce(
    (sum, course) => sum + Number(course.price),
    0
  )

  res.json({
    name,
    email,
    phone,
    role,
    registrationCardIssued,
    totalOrders,
    courseStatus,
    totalPaid,
    certificates,
  })
}
