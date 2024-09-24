const { MissingParamError } = require("../errors/missing-param-error")
const { InvalidParamError } = require("../errors/invalid-param-error")
const checkMissingParams = require("../validators/check-missing-params")
const signupInvalidParams = require("../validators/signup/signup-invalid-params")
const passwordHasher = require("../validators/password-validator")
const cpfValidator = require("../validators/cpf-validator")
const emailValidator = require("../validators/email-validator")

const User = require("../auth/models/User")

describe("Sign Up Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("Deve lançar MissingParamError se faltar algum campo", () => {
    const userMock = {
      name: "name",
      email: "usermail@mail",
      password: "123",
    }

    const userReq = {
      name: "name",
      email: "usermail@mail",
    }

    expect(() => {
      checkMissingParams(userReq, userMock)
    }).toThrow(MissingParamError)
  })

  test("Deve lançar InvalidParamError se o email já existir no banco de dados", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      email: "teste@teste.com",
      cpf: "12345678900",
    })

    const userMock = { email: "teste@teste.com", cpf: "11122233344" }

    await expect(signupInvalidParams(userMock)).rejects.toThrow(InvalidParamError)
  })

  test("Deve lançar InvalidParamError se o cpf já existir no banco de dados", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      email: "teste@teste.com",
      cpf: "12345678900",
    })

    const userMock = { email: "outro@teste.com", cpf: "12345678900" }

    await expect(signupInvalidParams(userMock)).rejects.toThrow(InvalidParamError)
  })

  test("Não deve lançar erro se o email e cpf forem novos", async () => {
    // Mock para simular que nenhum usuário com o mesmo email ou cpf foi encontrado
    User.findOne = jest.fn().mockResolvedValue(null)

    const userMock = { email: "novo@teste.com", cpf: "98765432100" }

    await expect(signupInvalidParams(userMock)).resolves.not.toThrow()
  })

  test("Deve lançar InvalidParamError se a senha não for válida", async () => {
    const userMock = {
      name: "Miguel teste",
      email: "teste@teste.com",
      cpf: "000.000.000-10",
      password: "tenha",
    }

    await expect(passwordHasher(userMock.password)).rejects.toThrow(InvalidParamError)
  })

  test("Deve lançar InvalidParamError se o cpf não for válido", async () => {
    const userMock = {
      name: "Miguel teste",
      email: "teste@teste.com",
      cpf: "00000000010",
      password: "tenha",
    }

    await expect(cpfValidator(userMock.cpf)).rejects.toThrow(InvalidParamError)
  })

  test("Deve lançar InvalidParamError se o e-mail não for válido", async () => {
    const userMock = {
      name: "Miguel teste",
      email: "teste.com",
      cpf: "00000000010",
      password: "tenha",
    }

    await expect(emailValidator(userMock.email)).rejects.toThrow(InvalidParamError)
  })
})
