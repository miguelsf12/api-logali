require("dotenv").config()

const express = require("express")

const authRoutes = require("./users/routes/authRoutes")

const app = express()

app.use(express.json())

app.use(express.static("public"))

// Rotas
app.use("/auth", authRoutes)

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000")
})
