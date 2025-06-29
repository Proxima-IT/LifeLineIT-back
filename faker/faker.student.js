const mongoose = require("mongoose")
const { faker } = require("@faker-js/faker")
const User = require("../models/Student")
function generateObjectId() {
  return new mongoose.Types.ObjectId()
}

function generateFakeStudent() {
  const enrolledCourses = Array.from({
    length: faker.number.int({ min: 1, max: 3 }),
  }).map(() => ({
    courseId: generateObjectId(),
    enrolledAt: faker.date.past({ years: 1 }),
    paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
  }))

  const certificates = Array.from({
    length: faker.number.int({ min: 0, max: 2 }),
  }).map(() => ({
    courseId: generateObjectId(),
    certificateId: generateObjectId(),
    issued: faker.datatype.boolean(),
  }))

  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    phone: faker.phone.number("+8801#########"),
    password: faker.internet.password(12),
    role: faker.helpers.arrayElement(["student", "admin"]),
    enrolledCourses,
    certificates,
    registrationCardIssued: faker.datatype.boolean(),
  }
}

async function main() {
  await mongoose.connect(
    "mongodb+srv://rup:rup@lifeline.ro2bmfc.mongodb.net/LifeLine?retryWrites=true&w=majority&appName=lifeline"
  )

  console.log("MongoDB connected")

  const fakeStudents = Array.from({ length: 100000 }, generateFakeStudent)

  const inserted = await User.insertMany(fakeStudents)

  console.log(`${inserted.length} fake students inserted`)

  mongoose.connection.close()
}

main().catch((err) => {
  console.error(err)
  mongoose.connection.close()
})
