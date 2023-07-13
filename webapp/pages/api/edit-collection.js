import { Redis } from "@upstash/redis"
import { ethers } from "ethers"

require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { chainId, signedMessage, formData, collection } = req.body

  // const newData = data.newData
  if (!chainId) {
    return res.status(200).send({ code: 500, message: "Wrong chainId" })
  }

  const messageHash = ethers.utils.hashMessage(
    ethers.utils.arrayify(ethers.utils.toUtf8Bytes(collection))
  )

  const recoveredAddress = ethers.utils.recoverAddress(
    messageHash,
    signedMessage
  )

  const target = await redis.hget(`${chainId}_collections`, collection)
  if (target == null) {
    return res.status(200).send({ code: 500, message: "Wrong collection" })
  }
  if (target.collection !== collection) {
    return res.status(200).send({ code: 500, message: "Wrong collection id" })
  }
  if (target.creator !== recoveredAddress) {
    return res
      .status(200)
      .send({ code: 500, message: "You are not the collection owner" })
  }

  let newData = Object.assign({}, target, {
    cover: formData.cover,
    profile: formData.profile,
    name: formData.name,
    description: formData.description,
    url: formData.url,
    category: formData.category,
    tags: formData.tags,
    site: formData.site,
    social: formData.social,
  })
  newData = JSON.stringify(newData)
  await redis.hset(`${chainId}_collections`, {
    [collection]: newData,
  })

  return res
    .status(200)
    .send({ code: 200, data: { status: 1 }, message: "success" })
}
