require("dotenv").config()
const authRoutes = require("./auth/routes/authRoutes")
const providerRoutes = require("./providers/routes/providerRoutes")
const clientRoutes = require("./client/routes/clientRoutes")
const serviceRoutes = require("./service/routes/serviceRoutes")

const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2
const { rateLimit } = require("express-rate-limit")
const client = require("./db/redis")
const { RedisStore } = require("rate-limit-redis")
const app = express()

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: "Muitas requisições. Por favor, tente novamente em 15 minutos.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => client.sendCommand(args),
  }),
})

app.set('trust proxy', 1)

app.use(cors())
app.use(express.json())
app.use("/public", express.static("src/public"))
app.use(globalLimiter)

// Rotas
app.use("/user/auth", authRoutes)
app.use("/user/provider", providerRoutes)
app.use("/user/client", clientRoutes)
app.use("/user/service", serviceRoutes)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// if (process.env.NODE_ENV !== "test") {
// Só inicia o servidor se não for ambiente de teste
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
// }
