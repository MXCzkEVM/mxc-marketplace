
import { ThirdwebSDK } from "@thirdweb-dev/sdk"
import { getJsonFromIPFS } from "./uploadToPinata"
import { IPFS_GATEWAY, zeroAddress } from "@/const/Local"
import { storageInterface } from "./thirdwebStorage"
import { NETWORK, } from "@/const/Network"
import { ABI, instanceCollection } from "@/const/Address"


export const getThirdWebNFTList = async (nftLis: any) => {
    return nftLis?.filter((item: any) => item.owner !== zeroAddress)
}

export const getNFTDetail = async (collection: string, tokenId: string) => {
    try {
        const sdk = new ThirdwebSDK(NETWORK, {}, storageInterface)
        // const sdk = new ThirdwebSDK(NETWORK)
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
        collectionInfo.cover = collectionInfo.cover ? `${IPFS_GATEWAY}${collectionInfo.cover}` : ''
        collectionInfo.profile = collectionInfo.profile ? `${IPFS_GATEWAY}${collectionInfo.profile}` : ''
        return collectionInfo
    } catch (error) {
        console.error(error, "getCollectInfo")
        return {}
    }
}

export const getCollectList = async (collectionsData: any) => {
    try {
        const collections = collectionsData.map((item: any) => {
            item.cover = item.cover ? `${IPFS_GATEWAY}${item.cover.replace("ipfs://", "")}` : ''
            item.profile = item.profile ? `${IPFS_GATEWAY}${item.profile.replace("ipfs://", "")}` : ''
            return item
        })
        return collections
    } catch (error) {
        console.error(error, "getNFTList")
        return []
    }
}