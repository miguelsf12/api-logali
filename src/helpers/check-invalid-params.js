const InvalidParamError = require("../errors/invalid-param-error")
const User = require("../users/models/user")

const checkInvalidParams = async (user) => {
  const { email, cpf } = user

  const existingUser = await User.findOne({
    $or: [{ email }, { cpf }],
  })

  if (existingUser) {
    const invalidField = existingUser.email === email ? "email" : "cpf"
    throw new InvalidParamError(invalidField)
  }
}

module.exports = checkInvalidParams
