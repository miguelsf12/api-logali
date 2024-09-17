const { createClient } = require("redis")

const client = createClient({
  url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
})

client.on("error", (err) => {
  console.error("Redis Client Error", err)
})
;(async () => {
  try {
    await client.connect()
    console.log("Redis client connected")
  } catch (err) {
    console.error("Error connecting to Redis", err)
  }
})()

module.exports = client
