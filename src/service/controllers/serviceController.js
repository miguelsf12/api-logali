const client = require("../../db/redis")
const Service = require("../../providers/models/Service")
const RoutesToService = require("../../services/RoutesToService")
const ServiceFilter = require("../filters/serviceFilter")

module.exports = class serviceController {
  static async getAllServices(req, res) {
    const services = await Service.find()

    res.json(services)
  }

  static async getServicesFiltered(req, res) {
    try {
      const { name, category, radius } = req.query

      // Filtros iniciais por nome e categoria
      const filters = {
        name,
        category,
      }

      // Instância do ServiceFilter para filtro por nome e categoria
      const serviceFilter = new ServiceFilter(filters)

      // Filtros por nome e categoria
      let filteredServices = await serviceFilter.filter()

      // Obtendo a localização atual do Redis
      const getLocation = await client.get("lastLocation")
      const lastLocation = JSON.parse(getLocation)

      if (lastLocation.latitude && lastLocation.longitude && radius) {
        // Atualiza os filtros com a localização do usuário
        const locationFilters = {
          lat: parseFloat(lastLocation.latitude),
          lng: parseFloat(lastLocation.longitude),
          radius: parseFloat(radius), // Raio vai ser transformado em metros no serviceFilter
        }

        // Instância do ServiceFilter para filtro por localização
        const locationFilter = new ServiceFilter({
          ...filters, // Nome e categoria já filtrados
          ...locationFilters, // Adiciona localização e raio
        })

        // Filtro por localização
        filteredServices = await locationFilter.filterByLocation()
      }

      console.log(lastLocation)

      res.json(filteredServices)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }

  static async getRoutesToServices(req, res) {
    try {
      const service = await Service.findById(req.params.id)

      const routesToService = new RoutesToService(process.env.key)

      const destination = {
        latitude: service.location.coordinates["0"],
        longitude: service.location.coordinates["1"],
      }

      const data = await routesToService.getRoutes(destination)

      const routes = data.routes.map((route) => {
        const { legs } = route

        return legs.map((leg) => {
          return {
            start_address: leg.start_address,
            end_address: leg.end_address,
            total_distance: leg.distance.text, // Ex: "21.2 km"
            total_duration: leg.duration.text, // Ex: "28 mins"
            overview_polyline: route.overview_polyline,
          }
        })
      })

      console.log(routes)

      res.json(routes)
    } catch (error) {
      res.status(400).json({ message: error.message })
    }
  }
}
