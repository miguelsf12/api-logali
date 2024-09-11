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

  test("Deve retornar false para um endereço inválido", async () => {
    // Mocka o fetch para retornar sem resultados
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ results: [] }),
      })
    )

    const address = "endereço inexistente"

    const isValid = await geocodingService.isValidAddress(address)

    expect(isValid).toBe(false)
  })
})
