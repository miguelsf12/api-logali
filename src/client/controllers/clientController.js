const User = require("../../auth/models/User")
const getUserByToken = require("../../helpers/get-user-by-token")
const getToken = require("../../helpers/get-token")
const MissingParamError = require("../../errors/missing-param-error")
const GeocodingService = require("../../services/GeocodingService")
const client = require("../../db/redis")
const cloudinary = require("cloudinary").v2
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

  static async editUser(req, res) {
    try {
      const userId = req.params.id
      const { name, email, address } = req.body
      const imageUser = req.file

      const body = {
        name,
        email,
        address,
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

      if (imageUser) {
        // Deletar as imagens antigas do Cloudinary usando o public_id
        if (userOn.image) {
          // for (const imageUrl of userOn.image) {
            // Extrair o public_id da URL
            const publicId = userOn.image.split("/").slice(-2).join("/").split(".")[0]
            await cloudinary.uploader.destroy(publicId)
          // }
        }

        // Fazer upload da nova imagem para o Cloudinary
        const imageCloudinary = await cloudinary.uploader.upload(imageUser.path, {
          folder: "user_images",
          use_filename: true,
        })

        userOn.image = imageCloudinary.secure_url
      }

      if (address) {
        const geocodingService = new GeocodingService(process.env.key)
        const userAddress = await geocodingService.getCordinates(address)

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
