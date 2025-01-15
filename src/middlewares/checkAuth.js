const jwt = require("jsonwebtoken")
const getToken = require("../helpers/get-token")
const UnauthorizedError = require("../errors/unauthorized-error")

const checkAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json(new UnauthorizedError())
  }

  const token = getToken(req)

  if (!token) {
    return res.status(401).json(new UnauthorizedError())
  }

  try {
    const verified = jwt.verify(token, process.env.secretKey)
    req.user = verified
    next()
  } catch (err) {
    return res.status(400).json(new UnauthorizedError())
  }
}

module.exports = checkAuth
