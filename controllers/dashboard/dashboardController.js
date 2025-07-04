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
    enrolledCourses,
    certificates,
  } = findStudent

  const approvedCourses = await Student.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.user.id),
      },
    },
    {
      $project: {
        _id: 0,
        enrolledCourses: {
          $filter: {
            input: "$enrolledCourses",
            as: "course",
            cond: {
              $eq: ["$$course.paymentStatus", "paid"],
            },
          },
        },
      },
    },
  ])

  const pendingCourses = await Student.aggregate([
    {
      $match: {
        _id: new Types.ObjectId(req.user.id),
      },
    },
    {
      $project: {
        _id: 0,
        enrolledCourses: {
          $filter: {
            input: "$enrolledCourses",
            as: "course",
            cond: {
              $eq: ["$$course.paymentStatus", "pending"],
            },
          },
        },
      },
    },
  ])

  console.log(pendingCourses)

  res.json({
    name,
    email,
    phone,
    role,
    registrationCardIssued,
    enrolledCourses,
    pendingCourses,
    approvedCourses,
    certificates,
  })
}
