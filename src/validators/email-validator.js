const validator = require("validator")
const InvalidParamError = require("../errors/invalid-param-error")

const emailValidator = async (email) => {
  if (!validator.isEmail(email)) {
    throw new InvalidParamError("email")
  }
}

module.exports = emailValidator
