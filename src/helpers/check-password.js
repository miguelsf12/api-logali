const bcrypt = require("bcrypt")
const InvalidParamError = require("../errors/invalid-param-error")

const checkPassword = async (password, dbPassword) => {
  const check = await bcrypt.compare(password, dbPassword)
  if (!check) {
    throw new InvalidParamError("password")
  }
}

module.exports = checkPassword
