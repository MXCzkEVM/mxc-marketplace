const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")
const { getDeployments, contractAttach } = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let nftFactory = await getDeployments("MXCCollectionFactory")
    let marketplace = await getDeployments("MXCMarketplace")

    // deployer balance
    // let res = await nftFactory.fetchCollections()
    // console.log(res)

    // let res = await nftFactory.fetchUserCollections(
    //     "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    // )
    // console.log(res)

    // await nftFactory.editCollection("0x87d4C99FdC4180F7BF9fd9Bf19D4e7E6787Cbc71")
    // await nftFactory.delCollection("0xC12BA7E5ad7eA51C4210Ba65262e0d5b119a5f13")
    // create collection

    // await createColelction()
    await NFThandle()
    // await editColelction()
}

async function editColelction() {
    const gasPrice = await ethers.provider.getGasPrice()
    let nftFactory = await getDeployments("MXCCollectionFactory")
    // await nftFactory.editCollection(
    //     "0xa436a101618D113e8313551BC0BcAFf303E165D6",
    //     "QmQ7eAeBWU7UmQhEQtMXWV6ZAi9d3FXUyjnW1eyd95PdZY",
    //     { gasPrice: gasPrice.mul(2) }
    // )
    // await nftFactory.editCollection(
    //     "0xafF1d7515B8E10AF72c6Ae61e1be69426F0Ec4F4",
    //     "QmZSt4LXtk1QWZduP1TRDXrrLjgqhJc3NajYViHPWvfWjN",
    //     { gasPrice: gasPrice.mul(2) }
    // )
    await nftFactory.editCollection(
        "0xF59259C86724f54BA00e9B9654a385dd4f012B03",
        "QmWZsgrfYtaKwtLsS1XSxZ6Xmp8oJZxi4h6u33JPWpFctA",
        { gasPrice: gasPrice.mul(2) }
    )
    // await nftFactory.editCollection(
    //     "0x78C417c716a5309818e670B7D82256B4647e27C1",
    //     "QmbCTPWXktxTN6hWck6fcbQPTRCFh9XBhYe9i6vLm3vfbn",
    //     { gasPrice: gasPrice.mul(2) }
    // )
}

async function NFThandle() {
    const [deployer, user] = await ethers.getSigners()
    let marketplace = await getDeployments("MXCMarketplace")
    let nftFactory = await getDeployments("MXCCollectionFactory")

    const collectionMap = {
        // Gin: "0xa436a101618D113e8313551BC0BcAFf303E165D6",
        // Tiffany: "0x4dBc338aca436501eA17082443b3b1f872FEbB18",
        // Kicks: "0xafF1d7515B8E10AF72c6Ae61e1be69426F0Ec4F4",
        // Diamond: "0xF59259C86724f54BA00e9B9654a385dd4f012B03",
        // whiskey: "0x78C417c716a5309818e670B7D82256B4647e27C1",
    }

    // let res = await nftFactory.fetchCollections()
    // console.log(res)

    // console.log(await nft.totalSupply())
    // console.log(await nft.tokenUri())
    let nft = await contractAttach(
        "MXCCollectionV2",
        "0xa16E02E87b7454126E5E10d957A927A7F5B5d2be"
    )
    const jsonIpfs = "ipfs://QmTebZ6SYmRffjLNJopEwkwMxwRLGoPqrZVMLkU4JNksGx"
    // await nft.mint(jsonIpfs)
    // await nft.mint(jsonIpfs)
    // await nft.mint(jsonIpfs)
    // await nft.mint(jsonIpfs)
    await nft.burn(1)

    // const txResult = await contract.erc721.burn("{{token_id}}");

    // await nft.approve("0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", 0)

    // for (let i in collectionMap) {
    //     let nft = await contractAttach("MXCCollectionV2", collectionMap[i])
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     // let res = await nft.setApprovalForAll(marketplace.address, true, {
    //     //     gasPrice: gasPrice.mul(2),
    //     // })
    //     let res = await nft.isApprovedForAll(
    //         deployer.address,
    //         marketplace.address
    //     )
    //     console.log(res)
    // }

    // gin1698 - QmZwyTEdjnA8CW9924Aa6f9AjSu3AFpLHfhHhKndDdqJE9
    // for (let i = 2; i < 10; i++) {
    //     // console.log(i)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     const jsonIpfs = "ipfs://QmZwyTEdjnA8CW9924Aa6f9AjSu3AFpLHfhHhKndDdqJE9"
    //     await nft.mint(jsonIpfs, { gasPrice: gasPrice.mul(2) })
    // }

    // Tiffany
    // for (let i = 1; i < 10; i++) {
    //     console.log(i)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     const jsonIpfs = "ipfs://QmVxqfwpgqaNeBEcYRNBr4q9HUsCW1snyAkGNpLSTm7MkQ"
    //     await nft.mint(jsonIpfs, { gasPrice: gasPrice.mul(2) })
    // }

    // Kicks
    // for (let i = 1; i < 10; i++) {
    //     console.log(i)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     const jsonIpfs = "ipfs://Qmc8ySuY38vGtNZAhiB9hXPPiHF656CY6ssA8DDR2LYVwA"
    //     await nft.mint(jsonIpfs, { gasPrice: gasPrice.mul(2) })
    // }

    // Diamond
    // for (let i = 1; i < 10; i++) {
    //     console.log(i)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     const jsonIpfs = "ipfs://QmRj4uwxQX3Pvs6K7bJdzb118MjojBsXX3UFMnBNwaouci"
    //     await nft.mint(jsonIpfs, { gasPrice: gasPrice.mul(2) })
    // }

    // whiskey
    // for (let i = 1; i < 10; i++) {
    //     console.log(i)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     const jsonIpfs = "ipfs://QmXqhSfffZXe5TW6TPbxDPe5qmhZ7UXuWF9dcx6haBeoKf"
    //     await nft.mint(jsonIpfs, { gasPrice: gasPrice.mul(2) })
    // }
}

async function createColelction() {
    let nftFactory = await getDeployments("MXCCollectionFactory")

    {
        let name = "Nakamigos",
            symbol = "Nakamigos"
        let royaltiesCutPerMillion = 0
        let royaltyRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        let jsonIpfs = "QmdtUi4zUuWnZ3iRRodX3GyUw3JurNWxv6CY8u8eUiHCvg"
        await nftFactory.createCollection(
            name,
            symbol,
            royaltiesCutPerMillion,
            royaltyRecipient,
            jsonIpfs
        )
    }

    {
        let name = "BEANZ Official",
            symbol = "BEANZ Official"
        let royaltiesCutPerMillion = 500
        let royaltyRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        let jsonIpfs = "QmTEmb6vp6R2rESZvaw1se3ES9m8cwczpcdGod2bHqFKqG"
        await nftFactory.createCollection(
            name,
            symbol,
            royaltiesCutPerMillion,
            royaltyRecipient,
            jsonIpfs
        )
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
