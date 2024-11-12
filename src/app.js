require("dotenv").config()
const authRoutes = require("./auth/routes/authRoutes")
const providerRoutes = require("./providers/routes/providerRoutes")
const clientRoutes = require("./client/routes/clientRoutes")
const serviceRoutes = require("./service/routes/serviceRoutes")

const express = require("express")
const cors = require("cors")
const cloudinary = require("cloudinary").v2
const app = express()

app.use(cors())
app.use(express.json())
app.use("/public", express.static("src/public"))

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

if (process.env.NODE_ENV !== "test") {
  // Só inicia o servidor se não for ambiente de teste
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
  })
}
