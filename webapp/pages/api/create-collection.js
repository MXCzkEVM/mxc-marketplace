import { Redis } from "@upstash/redis"
require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { data } = req.body

  const chainId = data.chainId
  const collection = data.collection
  data.timestamp = new Date().getTime()

  const target = JSON.stringify(data)

  await redis.hset(`${chainId}_collections`, {
    [collection]: target,
  })

  return res.status(200).send({ status: 200 })
}
