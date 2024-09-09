const mongoose = require("../../db/conn")

const { Schema } = mongoose

const ServiceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    type: Object,
    required: true,
  },
  provider: {
    type: Object,
    required: true
  }
})

const Service = mongoose.model("Service", ServiceSchema)

module.exports = Service
