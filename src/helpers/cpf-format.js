const { cpf } = require("cpf-cnpj-validator")

const cpfFormat = (userCpf) => {
  return cpf.format(userCpf)
}

module.exports = cpfFormat
