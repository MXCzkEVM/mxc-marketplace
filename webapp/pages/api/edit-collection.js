import { Redis } from "@upstash/redis"
import { ethers } from "ethers"
import { instanceNameWrapper } from "../../const/Address"
// @ts-ignore
import namehash from "eth-ens-namehash"
import i18n from "../../util/i18n"

require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  let { chainId, signedMessage, formData, collection } = req.body
  const redisDomainKey = `${chainId}_use_domains`
  // const newData = data.newData
  if (!chainId) {
    return res.status(200).send({ code: 500, message: i18n.t("Wrong chainId") })
  }
  if (!signedMessage) {
    return res
      .status(200)
      .send({ code: 500, message: i18n.t("Sign message is need") })
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

  if (formData.url) {
    const indexOf = await redis.lpos(`${chainId}_use_domains`, formData.url)
    if (indexOf !== null)
      return res.status(200).send({
        code: 500, message: i18n.t("The domain name is already in use."),
      })

    // check domain
    const nameWrapper = await instanceNameWrapper()
    let nameOwner = await nameWrapper.ownerOf(
      ethers.BigNumber.from(namehash.hash(formData.url))
    )
    if (target.creator !== nameOwner.toString())
      return res.status(200).send({
        code: 500, message: i18n.t("You are not the domain owner")
      })

    if (target.url) {
      const index = await redis.lpos(redisDomainKey, target.url)
      await redis.lset(redisDomainKey, index, formData.url)
    } else {
      await redis.lpush(redisDomainKey, formData.url)
    }

    await redis.hset(`${chainId}_collections_map`, {
      [formData.url]: collection,
    })
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
    .send({ code: 200, data: { status: 1 }, message: i18n.t("success") })
}
