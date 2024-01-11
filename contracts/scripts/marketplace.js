const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")
const { getDeployments, contractAttach } = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // deployer balance
    // let res = await nftFactory.fetchCollections()
    // console.log(res)

    await createColelction()
    // await createNFT()
    // await makeOrder()
    // await excuteOrder()
}

async function excuteOrder() {
    const [deployer, user] = await ethers.getSigners()
    let nftMarketplace = await contractAttach(
        "MXCMarketplaceUpgrade",
        "0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2"
    )
    const collectionAddress = "0x19887DACDcc657B77880b7648fe869Ac3Ef7a8fd"
    const gasPrice = await ethers.provider.getGasPrice()
    // let res = await nftMarketplace
    //     .connect(user)
    //     .executeOrder(collectionAddress, 0, {
    //         value: parseEther("100000"),
    //         gasPrice: gasPrice.mul(2),
    //     })
    // console.log(res) estimateGas
    let res = await nftMarketplace
        .connect(user)
        .estimateGas.executeOrder(collectionAddress, 3, {
            value: parseEther("100000"),
            gasPrice: gasPrice.mul(2),
        })
    console.log(formatEther(res))
}

async function makeOrder() {
    let nftMarketplace = await contractAttach(
        "MXCMarketplaceUpgrade",
        "0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2"
    )
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0x1fF4332089e649Ff98C8cE3BFA0137aF9bE6B67a"
    // )

    const collectionAddress = "0x19887DACDcc657B77880b7648fe869Ac3Ef7a8fd"

    let date = new Date()
    date.setMonth(date.getMonth() + 6)
    let expiresAt = Math.floor(date.getTime() / 1000)
    for (let i = 0; i < 10; i++) {
        console.log(i, 9999)
        const gasPrice = await ethers.provider.getGasPrice()

        // let res = await nftMarketplace.callStatic.createOrder(
        //     collectionAddress,
        //     i,
        //     parseEther("100000"),
        //     expiresAt,
        //     {
        //         gasPrice: gasPrice.mul(2),
        //     }
        // )
        // console.log(res)

        await nftMarketplace.createOrder(
            collectionAddress,
            i,
            parseEther("100000"),
            expiresAt,
            {
                gasPrice: gasPrice.mul(2),
            }
        )
    }
}

async function createNFT() {
    // let total = await nftCollection.totalSupply()
    // console.log(total)
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0x6D88bA27329f463b4b5d467a1f016C773aFb9e83"
    // )
    // for (let i = 1; i < 10; i++) {
    //     console.log(i, 9999)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     await nftCollection.mint(
    //         "ipfs://QmXqhSfffZXe5TW6TPbxDPe5qmhZ7UXuWF9dcx6haBeoKf",
    //         { gasPrice: gasPrice.mul(2) }
    //     )
    // }
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0x19887DACDcc657B77880b7648fe869Ac3Ef7a8fd"
    // )
    // for (let i = 1; i < 10; i++) {
    //     console.log(i, 9999)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     await nftCollection.mint(
    //         "ipfs://QmRj4uwxQX3Pvs6K7bJdzb118MjojBsXX3UFMnBNwaouci",
    //         { gasPrice: gasPrice.mul(2) }
    //     )
    // }
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0x1fF4332089e649Ff98C8cE3BFA0137aF9bE6B67a"
    // )
    // for (let i = 1; i < 10; i++) {
    //     console.log(i, 9999)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     await nftCollection.mint(
    //         "ipfs://QmUrYksPPQEYcZ9Ar5MnDwKLLoa9PEyhb2UzqVJj3KqWmT",
    //         { gasPrice: gasPrice.mul(2) }
    //     )
    // }
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0xDCA7C1e49e317271b1CEa3f17eE22707BD40C433"
    // )
    // for (let i = 1; i < 10; i++) {
    //     console.log(i, 9999)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     await nftCollection.mint(
    //         "ipfs://QmPsCDui85Cb6yfvUKXUkj6i8giVUAYASbxhdkfwSZA9cv",
    //         { gasPrice: gasPrice.mul(2) }
    //     )
    // }
    // let nftCollection = await contractAttach(
    //     "MXCCollectionV2Upgrade",
    //     "0x588Fd9832f03545775966513597ebC6b2a1B3685"
    // )
    // for (let i = 1; i < 10; i++) {
    //     console.log(i, 9999)
    //     const gasPrice = await ethers.provider.getGasPrice()
    //     await nftCollection.mint(
    //         "ipfs://Qmc8ySuY38vGtNZAhiB9hXPPiHF656CY6ssA8DDR2LYVwA",
    //         { gasPrice: gasPrice.mul(2) }
    //     )
    // }
}

async function createColelction() {
    const [owner, user] = await ethers.getSigners()
    let nftFactory = await getDeployments("MXCCollectionFactoryV2")

    console.log(owner.address, "owner")
    console.log(user.address, "user")

    {
        let name = "Nakamigos",
            symbol = "Nakamigos"
        let royaltiesCutPerMillion = 0
        let royaltyRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"

        let filterCollection = nftFactory.filters.newCollectionEvent(
            null,
            owner.address
        )
        nftFactory.once(filterCollection, (collectionAddress, creator) => {
            console.log(collectionAddress, "collectionAddress")
            console.log(creator, "creator")
        })

        await nftFactory
            .connect(user)
            .createCollection(
                name,
                symbol,
                royaltiesCutPerMillion,
                royaltyRecipient
            )

        // console.log(newAddress)
        await nftFactory
            .connect(user)
            .createCollection(
                name,
                symbol,
                royaltiesCutPerMillion,
                royaltyRecipient
            )
    }

    // {
    //     let name = "BEANZ Official",
    //         symbol = "BEANZ Official"
    //     let royaltiesCutPerMillion = 500
    //     let royaltyRecipient = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    //     let jsonIpfs = "QmTEmb6vp6R2rESZvaw1se3ES9m8cwczpcdGod2bHqFKqG"
    //     await nftFactory.createCollection(
    //         name,
    //         symbol,
    //         royaltiesCutPerMillion,
    //         royaltyRecipient,
    //         jsonIpfs
    //     )
    // }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
