const MissingParamError = require("../../errors/missing-param-error")
const Service = require("../../providers/models/Service")

class ServiceFilter {
  constructor(filters) {
    this.filters = filters
  }

  async filter() {
    const query = {}

    // Adiciona o filtro de categoria se estiver presente
    if (this.filters.category) {
      query.category = new RegExp(this.filters.category, "i")
    }

    // Adiciona o filtro de nome se estiver presente
    if (this.filters.name) {
      query.name = new RegExp(this.filters.name, "i")
    }

    return await Service.find(query)
  }

  async filterByLocation() {
    const { lat, lng, radius } = this.filters

    if (!lat || !lng || !radius) {
      throw new MissingParamError(
        "Latitude, longitude, and radius are required for location filter"
      )
    }

    // Conversão de raio para metros
    const radiusInMeters = parseFloat(radius * 1000)

    // Consulta com $geoWithin para encontrar serviços dentro do raio
    return await Service.find({
      "location.coordinates": {
        $geoWithin: {
          $centerSphere: [[lat, lng], radiusInMeters / 6378100], // Raio da Terra em metros
        },
      },
    })
  }
}

module.exports = ServiceFilter
