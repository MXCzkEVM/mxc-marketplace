import { Redis } from "@upstash/redis"
require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { chainId, collection_id } = req.body

  if (!chainId) {
    return res.status(200).send({ status: 500 })
  }

  let ops = await redis.hget(`${chainId}_collections`, collection_id)
  if (ops == null) {
    return res.status(200).send({ code: 500, message: "Wrong collection" })
  }
  ops.tags = JSON.parse(ops.tags)

  return res
    .status(200)
    .send({ code: 200, data: { collection: ops }, message: "success" })
}
