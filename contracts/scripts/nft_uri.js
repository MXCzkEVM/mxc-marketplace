const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")
const { getDeployments, contractAttach, contracts } = require("./address.js")
const { storeJson } = require("./utils")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let nft = await contractAttach(
        "MXCCollectionV2Upgrade",
        contracts.yangcheng_nft
    )
    // let uri = await nft.tokenURI(4)
    let res = await nft.callStatic.setTokenURI(
        4,
        "ipfs://QmaQ8AGQVGh55CH4Z1x1ptPLByRyVycvEtmWxuMikMMj7S"
    )
    console.log(res)

    // const newData = {
    //     image: "QmQwa1Vtfc1ySaR4vLTzrnEji4QUum23FsBgnumFPiD3Pg",
    //     name: "Crab阳澄湖 #05",
    //     description:
    //         "The MXC Crab, originating from Yangcheng Lake (阳澄湖大闸蟹), marks the first Internet of Things (IoT) Non-Fungible Token (NFT) curated by MXC in 2021. Yangcheng Lake, a notable body of water in China, is renowned for its crabs. These Crab NFTs aren't just digital collectibles; they represent Real World Assets (RWAs) that can be physically redeemed. Utilizing M2Pro and Neo miners to verify their location, these RWAs are authenticated and certified by the robust MXC network, thereby ensuring a seamless blend of the virtual and physical worlds.",
    //     attributes: [
    //         { trait_type: "Year", value: "2021" },
    //         { trait_type: "Producer", value: "Yangcheng Lake" },
    //         { trait_type: "Tag", value: "MatchX IoT Water Sensor" },
    //         { trait_type: "Network", value: "NEO and M2Pro" },
    //         { trait_type: "Social Handle", value: "@MXCFoundation" },
    //         { trait_type: "Location Proofs", value: "MEP-1002" },
    //         { trait_type: "Source", value: "Yangcheng Lake Production" },
    //     ],
    //     isRealWorldNFT: true,
    // }

    // const json_data = JSON.stringify({
    //     pinataOptions: {},
    //     pinataMetadata: {
    //         name: newData.name,
    //     },
    //     pinataContent: newData,
    // })

    // let jsonIpfs = await storeJson(json_data)
    // if (!jsonIpfs) {
    //     toast.error("Upload json to ipfs failed.")
    //     return
    // }
    // console.log(jsonIpfs)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
