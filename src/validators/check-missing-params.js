const MissingParamError = require("../errors/missing-param-error")

const checkMissingParams = (objReal, objMock) => {
  for (let field in objMock) {
    if (!objReal[field]) {
      throw new MissingParamError(field)
    }
  }
}

module.exports = checkMissingParams
