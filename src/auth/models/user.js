const mongoose = require("../../db/conn")

const { Schema } = mongoose

const UserSchema = new Schema({
  provider: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  telephone: {
    type: String,
  },
  address: {
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
  image: {
    type: String,
    default: "",
  },
  password: {
    type: String,
    required: true,
  },
})

UserSchema.index({ location: "2dsphere" })

const User = mongoose.model("User", UserSchema)

module.exports = User
