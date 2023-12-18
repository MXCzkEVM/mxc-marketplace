import { Redis } from "@upstash/redis"
import { ethers } from "ethers"
import { instanceNameWrapper } from "../../const/Address"
import i18n from "../../util/i18n"

// @ts-ignore
import namehash from "eth-ens-namehash"

require("dotenv").config()
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  const locale = req.headers["accept-language"] || "en"
  i18n.changeLanguage(locale)

  let { formData, signedMessage } = req.body

  const chainId = formData.chainId
  const collection = formData.collection

  if (!chainId || !formData.creator) {
    return res.status(200).send({ code: 500, message: i18n.t("Wrong params") })
  }

  if (formData.url) {
    const indexOf = await redis.lpos(`${chainId}_use_domains`, formData.url)
    if (indexOf !== null)
      return res.status(200).send({
        code: 500, message: i18n.t("The domain name is already in use."),
      })
    if (!signedMessage)
      return res.status(200).send({
        code: 500, message: i18n.t("Sign message is need")
      })
    const messageHash = ethers.utils.hashMessage(
      ethers.utils.arrayify(ethers.utils.toUtf8Bytes(formData.url))
    )
    const recoveredAddress = ethers.utils.recoverAddress(
      messageHash,
      signedMessage
    )
    // check owner
    if (formData.creator !== recoveredAddress)
      return res.status(200).send({
        code: 500, message: i18n.t("You are not the collection owner"),
      })

    // check domain
    const nameWrapper = await instanceNameWrapper()
    let nameOwner = await nameWrapper.ownerOf(
      ethers.BigNumber.from(namehash.hash(formData.url))
    )
    if (formData.creator !== nameOwner.toString()) {
      return res
        .status(200)
        .send({ code: 500, message: i18n.t("You are not the domain owner") })
    }

    await redis.lpush(`${chainId}_use_domains`, formData.url)

    await redis.hset(`${chainId}_collections_map`, {
      [formData.url]: collection,
    })
  }

  formData.timestamp = new Date().getTime()

  const target = JSON.stringify(formData)
  await redis.hset(`${chainId}_collections`, {
    [collection]: target,
  })

  return res.status(200).send({ status: 200 })
}
