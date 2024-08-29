const mongoose = require("mongoose")

async function main() {
  if (process.env.NODE_ENV !== "test") {
    await mongoose.connect("mongodb://localhost:27017/api-logali")
    console.log("Conectou ao mongoose!")
  }
}

main().catch((err) => console.log(err))

module.exports = mongoose
