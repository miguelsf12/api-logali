require("dotenv").config()

const express = require("express")

const app = express()
const authRoutes = require("./users/routes/authRoutes")

app.use(express.json())

app.use(express.static("public"))

// Rotas
app.use("/auth", authRoutes)

// app.listen(3000, () => {
//   console.log("Servidor rodando na porta 3000")
// })

if (process.env.NODE_ENV !== "test") {
  // Só inicia o servidor se não for ambiente de teste
  app.listen(3000, () => {
    console.log("Servidor rodando na porta 3000")
  })
}
