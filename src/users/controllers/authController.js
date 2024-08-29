const User = require("../models/user")
const checkMissingParams = require("../../validators/check-missing-params")
const checkInvalidParams = require("../../validators/check-invalid-params")
const passwordValidator = require("../../validators/password-validator")
const cpfValidator = require("../../validators/cpf-validator")
const bcrypt = require("bcrypt")
const cpfFormat = require("../../helpers/cpf-format")
const emailValidator = require("../../validators/email-validator")

module.exports = class userController {
  static async register(req, res) {
    // Resgate da requisição
    const { name, email, cpf, password } = req.body

    try {
      // Usuario comparador
      const userMock = {
        name,
        email,
        cpf,
        password,
      }

      const user = {
        name,
        email,
        cpf,
        password,
      }

      checkMissingParams(user, userMock)
      await checkInvalidParams(user)
      await passwordValidator(user.password)
      await cpfValidator(user.cpf)
      await emailValidator(user.email)

      const ph = await bcrypt.hash(user.password, 12)

      // Criar usuário
      const userReady = new User({
        name,
        email,
        cpf: cpfFormat(user.cpf),
        password: ph,
      })

      const newUser = await userReady.save()
      res.status(201).json(newUser)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
