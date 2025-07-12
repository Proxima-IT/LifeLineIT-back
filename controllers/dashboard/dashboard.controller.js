const Student = require("../../models/Student")
const { Types } = require("mongoose")
const client = require("../../utils/redisClient")

exports.dashboardController = async (req, res) => {
  const CACHE_DATA = `student:${req.user.id}`
  const cachedData = await client.get(CACHE_DATA)

  if (cachedData) {
    return res.json(JSON.parse(cachedData))
  }

  const findStudent = await Student.findOne({ _id: req.user.id })
  const {
    sid,
    name,
    image,
    father,
    mother,
    gender,
    dateOfBirth,
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
    (sum, course) => sum + Number(course.paid),
    0
  )

  const responseData = {
    id: req.user.id,
    name,
    image,
    father,
    mother,
    gender,
    dateOfBirth,
    sid,
    email,
    phone,
    role,
    registrationCardIssued,
    totalOrders,
    courseStatus,
    totalPaid,
    certificates,
  }

  await client.set(CACHE_DATA, JSON.stringify(responseData), { EX: 3600 * 24 })

  res.json(responseData)
}
