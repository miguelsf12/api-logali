const GeocodingService = require("../services/GeocodingService")

// Mock da função fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        results: [
          {
            formatted_address: "Praça Getúlio Vargas, Centro, Esmeraldas",
            geometry: {
              location: {
                lat: -19.7640264,
                lng: -44.3127922,
              },
            },
          },
        ],
      }),
  })
)

describe("Locations Service", () => {
  const apiKey = "test-api-key"
  const geocodingService = new GeocodingService(apiKey)

  test("Deve retornar um endereço válido", async () => {
    const address = "praça getulio vargas centro esmeraldas"

    const coordinates = await geocodingService.getCordinates(address)

    expect(coordinates).toEqual({
      address: "Praça Getúlio Vargas, Centro, Esmeraldas",
      latitude: -19.7640264,
      longitude: -44.3127922,
    })

    expect(global.fetch).toHaveBeenCalledWith(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )
  })
})
