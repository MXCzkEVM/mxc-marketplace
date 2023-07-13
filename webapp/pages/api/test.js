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

  // const collection = {
  //   cover: "QmUuEgL4MjNADzGGbcddNquBhUhJLHz3zqXT3kUa5Jh4zj",
  //   profile: "QmPdkXDm2f5BeYZmr7EHGXkyC1BpPAVEat1ZzrD8k8ZGLH",
  //   name: "Chicken you beautiful",
  //   description: "Chicken, you're too beautiful, cha345",
  //   royaltyRecipient: "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
  //   royaltiesCutPerMillion: 0,
  //   category: "1",
  //   tags: [],
  //   site: "http",
  //   social: "dsfd",
  //   chainId: 5167003,
  //   creator: "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
  //   collection: "0x331b5BDDb75505AE2832e203A811CE981a4f1ad0",
  //   timestamp: 1689003051708,
  //   url: "",
  // }
  // const data = JSON.stringify(collection)

  // const target = await redis.hget(
  //   `5167003_collections`,
  //   "0x331b5BDDb75505AE2832e203A811CE981a4f1ad0"
  // )

  // await redis.hset(`5167003_collections`, {
  //   ["0x331b5BDDb75505AE2832e203A811CE981a4f1ad0"]: data,
  // })
  // console.log(target)

  return res.status(200).send({ status: 200, data: "hello" })
}
