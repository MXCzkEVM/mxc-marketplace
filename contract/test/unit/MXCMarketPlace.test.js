const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

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
const token2Uri = "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgAzuki"
const zeroAddress = "0x0000000000000000000000000000000000000000"

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCCollectionFactory Unit Tests", function () {
        let owner,
            addr1,
            addr2,
            royaltyRecevier,
            addrs,
            baseNft,
            marketplace,
            mxcCollectionFactory
        beforeEach(async () => {
            ;[owner, addr1, addr2, royaltyRecevier, ...addrs] =
                await ethers.getSigners()
            mxcCollectionFactory = await deployContracts(
                "MXCCollectionFactory",
                [owner.address]
            )
            marketplace = await deployContracts("MXCMarketplace")
            baseNft = await deployContracts("BasicNft", ["doge", "doge"])
            baseNft.mintNft()
        })

        describe("createOrder", function () {
            let Azuki, CryptoPunks, expiresAt
            beforeEach(async () => {
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address,
                    collect1Uri
                )
                await mxcCollectionFactory
                    .connect(addr1)
                    .createCollection(
                        marketplace.address,
                        "Azuki",
                        "Azuki",
                        10,
                        royaltyRecevier.address,
                        collect2Uri
                    )

                let allColelctions =
                    await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddress = allColelctions[0].collection
                let AzukiAddrress = allColelctions[1].collection
                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                CryptoPunks = await nftContract.attach(CryptoPunksAddress)
                Azuki = await nftContract.attach(AzukiAddrress)
                await CryptoPunks.mint(token1Uri)
                await Azuki.connect(addr1).mint(token2Uri)

                // add 6month
                expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60
            })
            it("requireERC721", async function () {
                await expect(
                    marketplace.createOrder(
                        zeroAddress,
                        0,
                        parseEther("1"),
                        expiresAt
                    )
                ).to.be.revertedWith("MXCMarketplace__InvalidNftAddress")
            })
            it("Only nft owner can do it", async function () {
                await expect(
                    marketplace.createOrder(
                        Azuki.address,
                        0,
                        parseEther("1"),
                        expiresAt
                    )
                ).to.be.revertedWith("MXCMarketplace__NotOwner")
            })
            it("Not approve", async function () {
                let isApprovedForAll = await CryptoPunks.isApprovedForAll(
                    owner.address,
                    marketplace.address
                )
                expect(isApprovedForAll).to.equal(true)

                await CryptoPunks.setApprovalForAll(marketplace.address, false)
                // isApprovedForAll = await CryptoPunks.isApprovedForAll(
                //     owner.address,
                //     marketplace.address
                // )
                // expect(isApprovedForAll).to.equal(false)
                // expect(await CryptoPunks.getApproved(0)).to.equal(
                //    zeroAddress
                // )
                // await CryptoPunks.approve(marketplace.address, 0);
                // await CryptoPunks.approve(zeroAddress, 0)
                await expect(
                    marketplace.createOrder(
                        CryptoPunks.address,
                        0,
                        parseEther("1"),
                        expiresAt
                    )
                ).to.be.revertedWith("MXCMarketplace__NotApproveFor")
            })

            it("Price is not allow", async function () {
                await expect(
                    marketplace.createOrder(
                        CryptoPunks.address,
                        0,
                        parseEther("0"),
                        expiresAt
                    )
                ).to.be.revertedWith("MXCMarketplace__PriceNotAllow")
            })
            it("ExpiresAt is not allow", async function () {
                expiresAt = (await getBlockTime()) + 10
                await expect(
                    marketplace.createOrder(
                        CryptoPunks.address,
                        0,
                        parseEther("1"),
                        expiresAt
                    )
                ).to.be.revertedWith("MXCMarketplace__InvalidExpiresAt")
            })
            it("create collection successful", async function () {
                await marketplace.createOrder(
                    CryptoPunks.address,
                    0,
                    parseEther("1"),
                    expiresAt
                )

                let {
                    seller,
                    nftAddress,
                    price,
                    expiresAt: expiresAtN,
                } = await marketplace.orderByAssetId(CryptoPunks.address, 0)
                expect(seller).to.equal(owner.address)
                expect(nftAddress).to.equal(CryptoPunks.address)
                expect(price).to.equal(parseEther("1"))
                expect(expiresAt).to.equal(expiresAtN)
            })
        })

        describe("cancelOrder", function () {
            let CryptoPunks
            beforeEach(async () => {
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address,
                    collect1Uri
                )
                let allColelctions =
                    await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddress = allColelctions[0].collection
                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                CryptoPunks = await nftContract.attach(CryptoPunksAddress)
                await CryptoPunks.mint(token1Uri)
                // add 6month
                const expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60

                await marketplace.createOrder(
                    CryptoPunks.address,
                    0,
                    parseEther("1"),
                    expiresAt
                )
            })
            it("Order will be exist", async function () {
                await expect(
                    marketplace.cancelOrder(CryptoPunks.address, 1)
                ).to.be.revertedWith("MXCMarketplace__InvalidOrder")
            })
            it("Order should owner cancel", async function () {
                await expect(
                    marketplace
                        .connect(addr1)
                        .cancelOrder(CryptoPunks.address, 0)
                ).to.be.revertedWith("MXCMarketplace__UnauthorizedUser")
            })
            it("Order cancel successful", async function () {
                let { seller, nftAddress, price } =
                    await marketplace.orderByAssetId(CryptoPunks.address, 0)
                expect(seller).to.equal(owner.address)
                expect(nftAddress).to.equal(CryptoPunks.address)
                expect(price).to.equal(parseEther("1"))

                await marketplace.cancelOrder(CryptoPunks.address, 0)

                let info = await marketplace.orderByAssetId(
                    CryptoPunks.address,
                    0
                )
                expect(info.seller).to.equal(zeroAddress)
                expect(info.nftAddress).to.equal(zeroAddress)
                expect(info.price).to.equal(0)
            })
        })

        describe("executeOrder", function () {
            let Azuki, CryptoPunks, expiresAt
            beforeEach(async () => {
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address,
                    collect1Uri
                )
                await mxcCollectionFactory
                    .connect(addr1)
                    .createCollection(
                        marketplace.address,
                        "Azuki",
                        "Azuki",
                        10,
                        owner.address,
                        collect2Uri
                    )
                let allColelctions =
                    await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddress = allColelctions[0].collection
                let AzukiAddress = allColelctions[1].collection
                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                CryptoPunks = await nftContract.attach(CryptoPunksAddress)
                Azuki = await nftContract.attach(AzukiAddress)
                await CryptoPunks.mint(token1Uri)
                await Azuki.connect(addr1).mint(token1Uri)
                // add 6month
                expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60
                await marketplace.createOrder(
                    CryptoPunks.address,
                    0,
                    parseEther("1"),
                    expiresAt
                )
            })
            it("Asset not for sell", async function () {
                await expect(
                    marketplace.executeOrder(CryptoPunks.address, 1)
                ).to.be.revertedWith("MXCMarketplace__AssetNotForSale")
            })
            it("Seller can't buy self", async function () {
                await expect(
                    marketplace.executeOrder(CryptoPunks.address, 0)
                ).to.be.revertedWith("MXCMarketplace__SenderIsSeller")
            })
            it("Order expired", async function () {
                await increaseTime(expiresAt + 10)
                await expect(
                    marketplace
                        .connect(addr1)
                        .executeOrder(CryptoPunks.address, 0)
                ).to.be.revertedWith("MXCMarketplace__OrderExpired")
            })
            it("Seller not owner", async function () {
                await CryptoPunks["safeTransferFrom(address,address,uint256)"](
                    owner.address,
                    addr2.address,
                    0
                )
                await expect(
                    marketplace
                        .connect(addr1)
                        .executeOrder(CryptoPunks.address, 0)
                ).to.be.revertedWith("MXCMarketplace__SellerNotOwner")
            })
            it("Price mismatch", async function () {
                await expect(
                    marketplace
                        .connect(addr1)
                        .executeOrder(CryptoPunks.address, 0, {
                            value: parseEther("0.01"),
                        })
                ).to.be.revertedWith("MXCMarketplace__PriceMisMatch")
            })
        })

        describe("executeOrder Lastest", function () {
            it("Order excute collectly", async function () {
                let royalty = 5

                await mxcCollectionFactory.createCollection(
                    "CryptoPunks",
                    "CryptoPunks",
                    royalty,
                    royaltyRecevier.address,
                    collect1Uri
                )

                let allColelctions =
                    await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddress = allColelctions[0].collection
                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                let CryptoPunks = await nftContract.attach(CryptoPunksAddress)
                await CryptoPunks.mint(token1Uri)

                // owner nft => user1
                await CryptoPunks["safeTransferFrom(address,address,uint256)"](
                    owner.address,
                    addr1.address,
                    0
                )

                // user1 create order
                expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60
                await CryptoPunks.connect(addr1).setApprovalForAll(
                    marketplace.address,
                    true
                )
                await marketplace
                    .connect(addr1)
                    .createOrder(
                        CryptoPunks.address,
                        0,
                        parseEther("1"),
                        expiresAt
                    )

                let royaltyRecevieBalance = await getBalance(
                    royaltyRecevier.address
                )
                let addr1Balance = await getBalance(addr1.address)

                // user2 executeOrder
                await marketplace
                    .connect(addr2)
                    .executeOrder(CryptoPunks.address, 0, {
                        value: parseEther("1"),
                    })

                let royaltyRecevieMore = (
                    await getBalance(royaltyRecevier.address)
                ).sub(royaltyRecevieBalance)
                let addr1More = (await getBalance(addr1.address)).sub(
                    addr1Balance
                )

                // royaltyRecevier will get the royalty fee
                // 1eth * 5/10000
                let royaltyFee = parseEther("1").mul(royalty).div(10000)
                expect(royaltyRecevieMore).to.equal(royaltyFee)

                // user1-seller will get the left
                expect(addr1More).to.equal(parseEther("1").sub(royaltyFee))

                // user2-buyer will get the nft
                expect(await CryptoPunks.ownerOf(0)).to.equal(addr2.address)
            })
        })

        describe("executeOrder collectionMarket", function () {
            it("Order excute collectly", async function () {
                let royalty = 5
                // owner create CryptoPunks collection
                await mxcCollectionFactory.createCollection(
                    "CryptoPunks",
                    "CryptoPunks",
                    royalty,
                    royaltyRecevier.address,
                    collect1Uri
                )

                let allColelctions =
                    await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddress = allColelctions[0].collection
                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                // CryptoPunks collection
                let CryptoPunks = await nftContract.attach(CryptoPunksAddress)
                await CryptoPunks.mint(token1Uri)

                // owner make a order
                expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60
                await CryptoPunks.setApprovalForAll(marketplace.address, true)
                await marketplace.createOrder(
                    CryptoPunks.address,
                    0,
                    parseEther("1"),
                    expiresAt
                )
                // address1 buy the nft
                await marketplace
                    .connect(addr1)
                    .executeOrder(CryptoPunks.address, 0, {
                        value: parseEther("1"),
                    })

                let collectionMarketInfo =
                    await marketplace.collectionMarketInfo(CryptoPunks.address)
                let floorPrice = await collectionMarketInfo.floorPrice
                let ceilingPrice = await collectionMarketInfo.ceilingPrice
                expect(floorPrice).to.equal(parseEther("1"))
                expect(ceilingPrice).to.equal(parseEther("1"))

                // address1 make a order
                expiresAt = (await getBlockTime()) + 6 * 30 * 24 * 60 * 60
                await CryptoPunks.connect(addr1).setApprovalForAll(
                    marketplace.address,
                    true
                )
                await marketplace
                    .connect(addr1)
                    .createOrder(
                        CryptoPunks.address,
                        0,
                        parseEther("20"),
                        expiresAt
                    )

                // address2 buy the nft
                await marketplace
                    .connect(addr2)
                    .executeOrder(CryptoPunks.address, 0, {
                        value: parseEther("20"),
                    })

                collectionMarketInfo = await marketplace.collectionMarketInfo(
                    CryptoPunks.address
                )
                floorPrice = await collectionMarketInfo.floorPrice
                ceilingPrice = await collectionMarketInfo.ceilingPrice
                expect(floorPrice).to.equal(parseEther("1"))
                expect(ceilingPrice).to.equal(parseEther("20"))
            })
        })
    })
}
