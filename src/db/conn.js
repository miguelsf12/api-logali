const mongoose = require("mongoose")

const uri = process.env.MONGO_ATLAS_URI

async function main() {
  // if (process.env.NODE_ENV !== "test") {
  await mongoose.connect(uri)
  // await mongoose.connect("mongodb://localhost:27017/api-logali")
  console.log("Conectou ao mongoose!")
  // }
}

main().catch((err) => console.log(err))

module.exports = mongoose
