const fetch = require("node-fetch")
const client = require("../db/redis")

class RoutesToService {
  constructor(apiKey) {
    this.apiKey = apiKey
  }

  async getRoutes(destination) {
    try {
      const getLocation = await client.get("lastLocation")

      if (!getLocation) {
        throw new Error("Last location not found in cache")
      }

      const lastLocation = JSON.parse(getLocation)

      const { latitude: latitudeOrigin, longitude: longitudeOrigin } = lastLocation

      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${latitudeOrigin},${longitudeOrigin}&destination=${destination.latitude},${destination.longitude}&key=${this.apiKey}`

      const response = await fetch(url)
      const data = response.json()

      return data
    } catch (error) {
      console.error("Erro ao buscar rotas:", error)
      throw new Error("Erro ao acessar o serviço.")
    }
  }
}

module.exports = RoutesToService
