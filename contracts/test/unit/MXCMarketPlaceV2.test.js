const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { contractAttach } = require("../../config/address.js")

const {
    deployContracts,
    getBlockTime,
    increaseTime,
} = require("../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const collect1Uri = "ipfs://QQ1"
const collect2Uri = "ipfs://QQ2"
const collect3Uri = "ipfs://QQ3"
const token1Uri =
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgCryptoPunks"
const zeroAddress = "0x0000000000000000000000000000000000000000"

/* 
deploy collection factory
deploy marketplace 
create collection
*/

const getExpiresAt = () => {
    let date = new Date()
    date.setMonth(date.getMonth() + 6)
    let expiresAt = Math.floor(date.getTime() / 1000)
    return expiresAt
}

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCCollectionFactoryGas Unit Tests", function () {
        let owner,
            addr1,
            addr2,
            addrs,
            marketPlaceProxy,
            marketPlaceProxyV2,
            mxcCollectionFactory
        beforeEach(async () => {
            ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
            mxcCollectionFactory = await deployContracts(
                "MXCCollectionFactoryV2",
                []
            )

            const MXCMarketplaceUpgrade = await ethers.getContractFactory(
                "MXCMarketplaceUpgrade"
            )
            marketPlaceProxy = await upgrades.deployProxy(
                MXCMarketplaceUpgrade,
                [],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )

            const MXCMarketplaceUpgradeV2 = await ethers.getContractFactory(
                "MXCMarketplaceUpgradeV2"
            )
            marketPlaceProxyV2 = await upgrades.deployProxy(
                MXCMarketplaceUpgradeV2,
                [],
                {
                    initializer: "initialize",
                    kind: "uups",
                }
            )
        })

        it("marketPlace V1", async function () {
            let [CryptoPunksprxoyAddress, creator] =
                await mxcCollectionFactory.callStatic.createCollection(
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address
                )
            await mxcCollectionFactory.createCollection(
                "CryptoPunks",
                "CryptoPunks",
                5,
                owner.address
            )

            let CryptoPunks = await contractAttach(
                "MXCCollectionV2Upgrade",
                CryptoPunksprxoyAddress
            )
            await CryptoPunks.mint(token1Uri)
            await CryptoPunks.mint(token1Uri)

            await CryptoPunks.setApprovalForAll(marketPlaceProxy.address, true)

            let createOrderGas = await marketPlaceProxy.estimateGas.createOrder(
                CryptoPunks.address,
                0,
                parseEther("100"),
                getExpiresAt()
            )
            console.log(createOrderGas.toString(), "createOrderGas")

            await marketPlaceProxy.createOrder(
                CryptoPunks.address,
                0,
                parseEther("100"),
                getExpiresAt()
            )

            let createOrderGas2 =
                await marketPlaceProxy.estimateGas.createOrder(
                    CryptoPunks.address,
                    1,
                    parseEther("100"),
                    getExpiresAt()
                )
            console.log(createOrderGas2.toString(), "createOrderGas2")

            let cancelOrderGas = await marketPlaceProxy.estimateGas.cancelOrder(
                CryptoPunks.address,
                0
            )
            console.log(cancelOrderGas.toString(), "cancelOrderGas")

            let executeOrderGas = await marketPlaceProxy
                .connect(addr2)
                .estimateGas.executeOrder(CryptoPunks.address, 0, {
                    value: parseEther("100"),
                })
            console.log(executeOrderGas.toString(), "executeOrderGas")
        })

        it("marketPlace V2", async function () {
            let [CryptoPunksprxoyAddress, creator] =
                await mxcCollectionFactory.callStatic.createCollection(
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address
                )
            await mxcCollectionFactory.createCollection(
                "CryptoPunks",
                "CryptoPunks",
                5,
                owner.address
            )

            let CryptoPunks = await contractAttach(
                "MXCCollectionV2Upgrade",
                CryptoPunksprxoyAddress
            )
            await CryptoPunks.mint(token1Uri)
            await CryptoPunks.mint(token1Uri)

            await CryptoPunks.setApprovalForAll(
                marketPlaceProxyV2.address,
                true
            )

            let createOrderGas =
                await marketPlaceProxyV2.estimateGas.createOrder(
                    CryptoPunks.address,
                    0,
                    parseEther("100"),
                    getExpiresAt()
                )
            console.log(createOrderGas.toString(), "createOrderGas")

            await marketPlaceProxyV2.createOrder(
                CryptoPunks.address,
                0,
                parseEther("100"),
                getExpiresAt()
            )

            let createOrderGas2 =
                await marketPlaceProxyV2.estimateGas.createOrder(
                    CryptoPunks.address,
                    1,
                    parseEther("100"),
                    getExpiresAt()
                )
            console.log(createOrderGas2.toString(), "createOrderGas2")

            let cancelOrderGas =
                await marketPlaceProxyV2.estimateGas.cancelOrder(
                    CryptoPunks.address,
                    0
                )
            console.log(cancelOrderGas.toString(), "cancelOrderGas")

            let executeOrderGas = await marketPlaceProxyV2
                .connect(addr2)
                .estimateGas.executeOrder(CryptoPunks.address, 0, {
                    value: parseEther("100"),
                })
            console.log(executeOrderGas.toString(), "executeOrderGas")

            // await marketPlaceProxyV2
            //     .connect(addr2)
            //     .executeOrder(CryptoPunks.address, 0, {
            //         value: parseEther("100"),
            //     })
        })
    })
}
