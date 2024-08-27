const MissingParamError = require("../errors/missing-param-error")

const checkMissingParams = (user, userMock) => {
  for (let field in userMock) {
    if (!user[field]) {
      throw new MissingParamError(field)
    }
  }
}

module.exports = checkMissingParams
