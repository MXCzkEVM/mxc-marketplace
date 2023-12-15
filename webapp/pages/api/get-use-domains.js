import { Redis } from "@upstash/redis"
import i18n from "../../util/i18n"

require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { chainId } = req.body

  if (!chainId) {
    return res.status(200).send({ status: 500 })
  }

  let ops = await redis.lrange(`${chainId}_use_domains`, 0, 100)
  if (ops == null) {
    return res.status(200).send({ code: 500, message: i18n.t("Wrong domains") })
  }

  return res
    .status(200)
    .send({ code: 200, data: { collection: ops }, message: i18n.t("success") })
}
