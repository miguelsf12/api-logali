const getToken = require("../../helpers/get-token")
const getUserByToken = require("../../helpers/get-user-by-token")
const GeocodingService = require("../../services/GeocodingService")
const Service = require("../models/Service")

module.exports = class providerController {
  static async addService(req, res) {
    try {
      const token = getToken(req)
      const user = await getUserByToken(token)
      const { name, description, category, location } = req.body

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
        provider: user,
      })

      const newProviderServices = await providerServices.save()

      res.status(200).json(newProviderServices)
    } catch (error) {
      res.status(400).json({ message: error.message })
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
      res.status(400).json({ message: error.message })
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
