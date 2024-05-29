import { Redis } from "@upstash/redis"
import { ethers } from "ethers"
import i18n from "../../util/i18n"

require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { chainId, signedMessage, collection } = req.body

  // const newData = data.newData
  if (!chainId) {
    return res.status(200).send({ code: 500, message: i18n.t("Wrong chainId") })
  }

  const messageHash = ethers.utils.hashMessage(
    ethers.utils.arrayify(ethers.utils.toUtf8Bytes(collection))
  )

  const recoveredAddress = ethers.utils.recoverAddress(
    messageHash,
    signedMessage
  )

  const target = await redis.hget(`${chainId}_launchpad_collections`, collection)
  if (target == null) {
    return res
      .status(200)
      .send({ code: 500, message: i18n.t("Wrong collection") })
  }
  if (target.collection !== collection) {
    return res
      .status(200)
      .send({ code: 500, message: i18n.t("Wrong collection id") })
  }
  if (target.creator !== recoveredAddress) {
    return res
      .status(200)
      .send({ code: 500, message: i18n.t("You are not the collection owner") })
  }

  if (target.url)
    await redis.lrem(`${chainId}_use_domains`, 0, target.url)
  await redis.hdel(`${chainId}_launchpad_collections`, collection)

  return res
    .status(200)
    .send({ code: 200, data: { status: 1 }, message: i18n.t("success") })
}
