const InvalidParamError = require("../errors/invalid-param-error")

class GeocodingService {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  // Metodo que retorna coordenadas
  async getCordinates(address) {
    // Codifica o endereço para URL
    const encodedAddress = encodeURIComponent(address)

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${this.apiKey}`

    try {
      const response = await fetch(url)
      const data = await response.json()

      if (data.results && data.results.length > 0) {
        const result = data.results[0]
        const { lat, lng } = result.geometry.location
        return {
          address: result.formatted_address,
          latitude: lat,
          longitude: lng,
        }
      } else {
        throw new InvalidParamError("Endereço não encontrado.")
      }
    } catch (error) {
      console.error("Erro ao buscar coordenadas:", error)
      throw new Error("Erro ao acessar o serviço de geocodificação.")
    }
  }
}

module.exports = GeocodingService
