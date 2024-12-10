const MissingParamError = require("../../errors/missing-param-error")
const Service = require("../../providers/models/Service")

class ServiceFilter {
  constructor(filters) {
    this.filters = filters
  }

  async filter() {
    const excludedWords = [
      "de",
      "no",
      "na",
      "do",
      "da",
      "a",
      "e",
      "para",
      "com",
      "em",
      "por",
    ]
    const query = {} // Inicializa o objeto da query

    // Adiciona o filtro de categoria
    if (this.filters.category) {
      query.category = new RegExp(this.filters.category, "i")
    }

    // Filtro por nome e descrição
    if (this.filters.name) {
      // Divide o nome em palavras, excluindo preposições e palavras irrelevantes
      const terms = this.filters.name
        .split(/\s+/)
        .filter((term) => !excludedWords.includes(term.toLowerCase())) // Filtra palavras indesejadas

      // Adiciona os filtros apenas com palavras relevantes
      if (terms.length > 0) {
        const nameOrDescriptionFilters = terms.map((term) => ({
          $or: [
            { name: new RegExp(term, "i") }, // Busca no nome
            { description: new RegExp(term, "i") }, // Busca na descrição
          ],
        }))

        // Inicializa query.$or se necessário e adiciona os filtros
        if (!query.$or) query.$or = []
        query.$or.push(...nameOrDescriptionFilters)
      }
    }

    return await Service.find(query).select("-provider.cpf")
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
    }).select("-provider.cpf")
  }
}

module.exports = ServiceFilter
