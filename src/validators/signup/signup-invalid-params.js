const InvalidParamError = require("../../errors/invalid-param-error")
const User = require("../../auth/models/user")

const signupInvalidParams = async (user) => {
  const { email, cpf } = user

  const existingUser = await User.findOne({
    $or: [{ email }, { cpf }],
  })

  if (existingUser) {
    const invalidField = existingUser.email === email ? "email" : "cpf"
    throw new InvalidParamError(invalidField)
  }
}

module.exports = signupInvalidParams
