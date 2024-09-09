require("dotenv").config()

const express = require("express")

const app = express()
const authRoutes = require("./users/routes/authRoutes")
const providerRoutes = require("./providers/routes/providerRoutes")
const clientRoutes = require("./client/routes/clientRoutes")

app.use(express.json())

app.use(express.static("public"))

// Rotas
app.use("/user/auth", authRoutes)
app.use("/user/provider", providerRoutes)
app.use("/user/client", clientRoutes)


if (process.env.NODE_ENV !== "test") {
  // Só inicia o servidor se não for ambiente de teste
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
  })
}
