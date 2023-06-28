
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { getJsonFromIPFS } from "./uploadToPinata"
import { IPFS_GATEWAY } from "@/const/Local"
import { NETWORK } from "@/const/Network"
import { ABI } from "@/const/Network"
import { zeroAddress } from "viem"

export const getNFTList = async (nftLis: any) => {
    return nftLis?.filter((item: any) => item.owner !== zeroAddress)
}

export const getNFTDetail = async (collection: string, tokenId: string) => {
    try {
        const sdk = new ThirdwebSDK(NETWORK)
        const contract = await sdk.getContract(collection, ABI.collection)

        let nft: any = await contract.erc721.get(tokenId)
        nft.image = IPFS_GATEWAY + nft.metadata.image
        return nft

    } catch (error) {
        console.error(error, "getNFTDetail")
        return {}
    }
}

export const getCollectInfo = async (collectionInfo: any) => {
    try {
        let ipfsObject = (await getJsonFromIPFS(collectionInfo.ipfs)) || {}
        ipfsObject.cover = `${IPFS_GATEWAY}${ipfsObject.cover}`
        ipfsObject.profile = `${IPFS_GATEWAY}${ipfsObject.profile}`

        let nwData = Object.assign({}, ipfsObject, {
            collection: collectionInfo.collection,
            owner: collectionInfo.owner,
        })
        return nwData
    } catch (error) {
        console.error(error, "getCollectInfo")
        return {
            cover: "",
            profile: "",
            collection: "",
            owner: "",
        }
    }
}

export const getCollectList = async (collectionsData: any) => {
    try {
        let collections = []
        for (let i = 0; i < collectionsData.length; i++) {
            let { ipfs, collection } = collectionsData[i]
            let item = (await getJsonFromIPFS(ipfs)) || {}
            collections.push({
                name: item.name,
                cover: `${IPFS_GATEWAY}${item.cover.replace("ipfs://", "")}`,
                profile: `${IPFS_GATEWAY}${item.profile.replace("ipfs://", "")}`,
                collection,
            })
        }
        return collections
    } catch (error) {
        console.error(error, "getNFTList")
        return []
    }
}