const User = require("../models/user")
const validator = require("validator")
const bcrypt = require("bcrypt")
const checkMissingParams = require("../../validators/check-missing-params")
const signupInvalidParams = require("../../validators/signup/signup-invalid-params")
const passwordValidator = require("../../validators/password-validator")
const cpfValidator = require("../../validators/cpf-validator")
const emailValidator = require("../../validators/email-validator")
const loginInvalidParams = require("../../validators/login/login-invalid-params")
const cpfFormat = require("../../helpers/cpf-format")
const checkPassword = require("../../helpers/check-password")
const createUserToken = require("../../helpers/create-user-token")
const GeocodingService = require("../../services/GeocodingService")

module.exports = class userController {
  static async register(req, res) {
    // Resgate da requisição
    const { name, email, cpf, password, address } = req.body

    try {
      // Usuario comparador
      const userMock = {
        name: "",
        email: "",
        cpf: "",
        password: "",
        address: "",
      }

      const user = {
        name,
        email,
        cpf: cpfFormat(cpf),
        password,
        address,
      }

      checkMissingParams(user, userMock)
      await signupInvalidParams(user)
      await passwordValidator(user.password)
      await cpfValidator(user.cpf)
      await emailValidator(user.email)

      const ph = await bcrypt.hash(user.password, 12)

      const geocodingService = new GeocodingService(process.env.key)
      const userAddress = await geocodingService.getCordinates(address)

      const geoLocation = {
        address: userAddress.address, // Endereço fornecido pelo usuário
        type: "Point",
        coordinates: [userAddress.latitude, userAddress.longitude], // longitude, latitude
      }

      // Criar usuário
      const userReady = new User({
        name,
        email,
        cpf: user.cpf,
        password: ph,
        address: geoLocation,
      })

      const newUser = await userReady.save()
      res.status(201).json(newUser)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async login(req, res) {
    const { password } = req.body
    let { identifier } = req.body

    try {
      const userMock = {
        id: "",
        password: "",
      }

      if (!validator.isEmail(identifier)) {
        identifier = cpfFormat(identifier)
        await cpfValidator(identifier)
      } else {
        await emailValidator(identifier)
      }

      let user = {
        id: identifier,
        password,
      }

      checkMissingParams(user, userMock)
      await loginInvalidParams(user.id)

      const userDb = await User.findOne({
        $or: [{ email: identifier }, { cpf: identifier }],
      })

      await checkPassword(user.password, userDb.password)

      createUserToken(userDb, req, res)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
