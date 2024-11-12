const getToken = require("../../helpers/get-token")
const getUserByToken = require("../../helpers/get-user-by-token")
const GeocodingService = require("../../services/GeocodingService")
const prohibitMoreServices = require("../../validators/prohibit-more-services")
const cloudinary = require("cloudinary").v2
const Service = require("../models/Service")

module.exports = class providerController {
  static async addService(req, res) {
    try {
      const token = getToken(req)
      const user = await getUserByToken(token)

      await prohibitMoreServices(user)

      const { name, description, category, location } = req.body

      const imagePaths = []

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "service_images",
          use_filename: true,
        })
        imagePaths.push(result.secure_url)
      }

      const geocodingService = new GeocodingService(process.env.key)
      const address = await geocodingService.getCordinates(location)

      // Formato de localização com endereço e coordenadas
      const geoLocation = {
        address: address.address, // Endereço fornecido pelo usuário
        type: "Point",
        coordinates: [address.latitude, address.longitude], // longitude, latitude
      }

      const providerServices = new Service({
        name,
        description,
        category,
        location: geoLocation,
        images: imagePaths,
        provider: user,
      })

      console.log(providerServices)

      user.provider = true

      await user.save()
      const newProviderServices = await providerServices.save()

      res.status(201).json(newProviderServices)
    } catch (error) {
      res.status(400).json({ message: error.message, status: 400 })
    }
  }

  static async editService(req, res) {
    try {
      const { name, description, category, location } = req.body

      const body = {
        name,
        description,
        category,
      }

      const serviceId = req.params.id
      const providerService = await Service.findById(serviceId)

      if (!providerService) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }

      for (let field in body) {
        if (body[field]) {
          providerService[field] = body[field]
        }
      }

      // Se houver imagens novas, fazer upload para o Cloudinary
      if (req.files && req.files.length > 0) {
        // Deletar as imagens antigas do Cloudinary usando o public_id
        for (const imageUrl of providerService.images) {
          // Extrair o public_id da URL
          const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0]
          await cloudinary.uploader.destroy(publicId) // Deletando a imagem antiga
        }

        // Fazer upload das novas imagens para o Cloudinary
        const imagePaths = []
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "service_images",
            use_filename: true,
          })
          imagePaths.push(result.secure_url)
        }

        providerService.images = imagePaths
      }

      if (location) {
        const geocodingService = new GeocodingService(process.env.key)
        const address = await geocodingService.getCordinates(location)

        const geoLocation = {
          address: address.address, // Endereço fornecido pelo usuário
          type: "Point",
          coordinates: [address.latitude, address.longitude], // longitude, latitude
        }

        providerService.location = geoLocation
      }

      await providerService.save()

      return res.status(200).json({
        message: "Serviço atualizado com sucesso",
        newService: providerService,
      })
    } catch (error) {
      res.status(400).json({ message: error.message, status: 400 })
    }
  }

  static async removeService(req, res) {
    const token = getToken(req)
    const user = getUserByToken(token)
    const serviceId = req.params.id

    try {
      const deletedProviderService = await Service.findByIdAndDelete(serviceId)

      if (!deletedProviderService) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }

      return res.status(200).json({
        message: "Serviço deletado com sucesso",
        deletedService: deletedProviderService,
      })
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
