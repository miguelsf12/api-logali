const jwt = require("jsonwebtoken")

const createUserToken = (user, req, res) => {
  const expiresIn = "30m"
  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    "para o sucesso, basta apenas começar",
    { expiresIn }
  )

  res.status(200).json({
    message: "Você está autenticado",
    token: token,
    userId: user._id,
  })
}

module.exports = createUserToken
