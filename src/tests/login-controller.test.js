const MissingParamError = require("../errors/missing-param-error")
const InvalidParamError = require("../errors/invalid-param-error")
const checkMissingParams = require("../validators/check-missing-params")
const loginInvalidParams = require("../validators/login/login-invalid-params")
const User = require("../auth/models/user")
const checkPassword = require("../helpers/check-password")

describe("Login Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test("Deve lançar MissingParamError se faltar algum campo", () => {
    const userMock = {
      email: "usermail@mail.com",
      password: "123",
    }

    const userReq = {
      email: "usermail@mail",
    }

    expect(() => {
      checkMissingParams(userReq, userMock)
    }).toThrow(MissingParamError)
  })

  test("Deve lançar InvalidParamError se o email não for encontrado", async () => {
    User.findOne = jest.fn().mockResolvedValue(null)

    const userMock = { email: "outroemail@teste.com", password: "123" }

    await expect(loginInvalidParams(userMock.email)).rejects.toThrow(
      InvalidParamError
    )
  })

  test("Deve lançar InvalidParamError se a senha não corresponder", async () => {
    User.findOne = jest.fn().mockResolvedValue({
      _id: "66d0cfb1e5ebf5e7d9471726",
      name: "Miguel teste",
      email: "teste@teste.com",
      cpf: "157.033.776-41",
      password: "$2b$12$PFMurFfgkoRiOJHLW1h7xeP/tFm/yhzOnsPdkuul9ghzuDENJcS8m",
      __v: 0,
    })

    const userMock = { email: "outroemail@teste.com", password: "123" }

    await expect(
      checkPassword(
        userMock.password,
        "$2b$12$PFMurFfgkoRiOJHLW1h7xeP/tFm/yhzOnsPdkuul9ghzuDENJcS8m"
      )
    ).rejects.toThrow(InvalidParamError)
  })
})
