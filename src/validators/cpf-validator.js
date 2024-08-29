const { cpf } = require("cpf-cnpj-validator")
const InvalidParamError = require("../errors/invalid-param-error")

const cpfValidator = async (userCpf) => {
  if (!cpf.isValid(userCpf)) {
    throw new InvalidParamError("cpf")
  }
}

module.exports = cpfValidator
