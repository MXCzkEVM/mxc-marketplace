import { Redis } from "@upstash/redis"
require("dotenv").config()
import { NETWORK } from "@/const/Network"
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  const rpc = NETWORK.rpc[0]

  // create collection
  // const object = { name: "John", age: 180 }
  // const myObjectAsString = JSON.stringify(object)
  // await redis.lpush("collections", myObjectAsString)

  return res.status(200).send({ status: 200, data: "hello" })
}
