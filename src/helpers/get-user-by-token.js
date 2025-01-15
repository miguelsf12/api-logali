const jwt = require("jsonwebtoken")

const User = require("../auth/models/User")
const UnauthorizedError = require("../errors/unauthorized-error")

const getUserByToken = async (token) => {
  if (!token) {
    return res.status(401).json(new UnauthorizedError())
  }

  const decoded = jwt.verify(token, process.env.secretKey)

  const userId = decoded.id

  const user = await User.findOne({ _id: userId }).select("-password")

  return user
}

module.exports = getUserByToken
