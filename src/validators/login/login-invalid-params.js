const InvalidParamError = require("../../errors/invalid-param-error")
const User = require("../../auth/models/user")
const validator = require("validator")

const loginInvalidParams = async (identifier) => {
  const existingUser = await User.findOne({
    $or: [{ email: identifier }, { cpf: identifier }],
  })

  if (!existingUser) {
    let field = "email"
    if (!validator.isEmail(identifier)) {
      field = "cpf"
    }
    throw new InvalidParamError(field)
  }
}

module.exports = loginInvalidParams
