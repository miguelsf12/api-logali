const User = require("../../auth/models/User")
const getUserByToken = require("../../helpers/get-user-by-token")
const getToken = require("../../helpers/get-token")
const MissingParamError = require("../../errors/missing-param-error")
const GeocodingService = require("../../services/GeocodingService")
const client = require("../../db/redis")
const UnauthorizedError = require("../../errors/unauthorized-error")
const Service = require("../../providers/models/Service")

module.exports = class clientController {
  static async getUserProfile(req, res) {
    try {
      const token = getToken(req)

      const user = await getUserByToken(token)

      res.status(200).json(user)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async edit(req, res) {
    try {
      const userId = req.params.id
      const { name, email, telephone, location } = req.body

      const body = {
        name,
        email,
        telephone,
        location,
      }

      const token = getToken(req)
      const userOn = await getUserByToken(token)

      if (userOn.id !== userId) {
        throw new UnauthorizedError()
      }

      const hasValidField = Object.values(body).some(
        (field) => field !== undefined && field !== null
      )

      if (!hasValidField) {
        throw new MissingParamError("Nenhum campo foi fornecido para edição.")
      }

      for (let field in body) {
        if (body[field]) {
          userOn[field] = body[field]
        }
      }

      if (location) {
        const geocodingService = new GeocodingService(process.env.key)
        const userAddress = await geocodingService.getCordinates(location)

        const geoLocation = {
          address: userAddress.address, // Endereço fornecido pelo usuário
          type: "Point",
          coordinates: [userAddress.latitude, userAddress.longitude], // longitude, latitude
        }

        userOn.address = geoLocation // Certifique-se que o schema aceita essa estrutura
      } else if (body.address) {
        delete body.address // Remova o campo address do body para evitar sobrescrita incorreta
      }

      await userOn.save()

      return res.status(200).json({
        message: "Perfil atualizado com sucesso",
        newProfile: userOn,
      })
    } catch (error) {
      res.status(400).json({ message: "Erro ao atualizar perfil", error: error.message })
    }
  }

  static async sendActualLocation(req, res) {
    try {
      const { address } = req.body.address

      const geocodingService = new GeocodingService(process.env.key)

      const location = await geocodingService.getCordinates(address)

      await client.set("lastLocation", JSON.stringify(location))

      const getLocation = await client.get("lastLocation")

      const lastLocation = JSON.parse(getLocation)
      res.status(200).json(lastLocation)
    } catch (error) {
      res.status(400).json({ message: error.message, status: "400" })
    }
  }
}
