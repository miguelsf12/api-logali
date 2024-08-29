const InvalidParamError = require("../errors/invalid-param-error")
const passwordValidator = require("password-validator")

const passwordHasher = async (password) => {
  const schema = new passwordValidator()
  schema
    .is()
    .min(8)
    .is()
    .max(20)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(["password", "123456", "qwerty"])

  if (!schema.validate(password)) {
    throw new InvalidParamError("password")
  }
}

module.exports = passwordHasher
