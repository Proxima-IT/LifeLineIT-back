const Student = require("../../models/Student")

exports.dashboardController = async (req, res) => {
  const { id } = req.user.id
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

  const { Types } = require("mongoose")

  const pendingCourses = await Student.aggregate([
    {
      $match: {
        _id: id,
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

  console.log(result)

  res.json({
    name,
    email,
    phone,
    password,
    role,
    registrationCardIssued,
    enrolledCourses,
    pendingCourses,
    certificates,
  })
}
