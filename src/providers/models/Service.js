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
    address: { type: String, required: true }, // Mantém o endereço
    type: {
      type: String,
      enum: ["Point"], // 'Point' é necessário para o MongoDB entender o tipo de dado geoespacial
      required: true,
    },
    coordinates: {
      type: [Number], // Array: [longitude, latitude]
      required: true,
    },
  },
  provider: {
    type: Object,
    required: true,
  },
})

ServiceSchema.index({ location: "2dsphere" })

const Service = mongoose.model("Service", ServiceSchema)

module.exports = Service
