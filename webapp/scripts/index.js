const { ThirdwebSDK } = require("@thirdweb-dev/sdk")
const collectionFactory = require("../const/abi_mxccollection/MXCCollectionFactory.json")
const collection = require("../const/abi_mxccollection/MXCCollectionV2.json")
const marketplace = require("../const/abi_mxccollection/MXCMarketplace.json")
require("dotenv").config()

const ABI = {
  marketplace,
  collectionFactory,
  collection,
}

const NETWORK = {
  chainId: 31337,
  rpc: ["http://127.0.0.1:8545"],
  nativeCurrency: {
    decimals: 18,
    name: "MXC Token",
    symbol: "MXC",
  },
  shortName: "wannsee",
  slug: "wannsee",
  testnet: true,
  chain: "Wannsee",
  name: "Wannsee zkEVM Testnet",
  icon: {
    url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
    height: 512,
    width: 512,
    format: "png",
  },
}

async function main() {
  // const sdk = ThirdwebSDK.fromPrivateKey(process.env.PRIVATE_KEY, NETWORK)
  // const contract = await sdk.getContract(
  //   "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be",
  //   ABI.collection
  // )
  // const txResult = await contract.erc721.burn("0")
  // console.log(txResult)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
