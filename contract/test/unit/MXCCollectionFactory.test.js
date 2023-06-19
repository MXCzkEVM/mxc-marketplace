const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const { deployContracts } = require("../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const collect1Uri = "ipfs://QQ1"
const collect2Uri = "ipfs://QQ2"
const collect3Uri = "ipfs://QQ3"
const token1Uri =
    "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgCryptoPunks"
const token2Uri = "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgAzuki"

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCCollectionFactory Unit Tests", function () {
        let owner, addr1, addr2, addrs, marketplace, mxcCollectionFactory
        beforeEach(async () => {
            ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()
            mxcCollectionFactory = await deployContracts("MXCCollectionFactory")
            marketplace = await deployContracts("MXCMarketplace")
        })

        describe("createCollection", function () {
            it("createCollection correctly", async function () {
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address,
                    collect1Uri
                )

                let collections = await mxcCollectionFactory.fetchCollections()
                let { ipfs, owner: owner_address } = collections[0]

                expect(ipfs).to.equal(collect1Uri)
                expect(owner_address).to.equal(owner.address)
            })
            it("event correctly", async function () {
                let collection =
                    await mxcCollectionFactory.callStatic.createCollection(
                        marketplace.address,
                        "CryptoPunks",
                        "CryptoPunks",
                        5,
                        owner.address,
                        collect1Uri
                    )
                await expect(
                    mxcCollectionFactory.createCollection(
                        marketplace.address,
                        "Azuki",
                        "Azuki",
                        5,
                        owner.address,
                        collect1Uri
                    )
                )
                    .to.emit(mxcCollectionFactory, "newCollectionEvent")
                    .withArgs(collection, owner.address)
            })
        })

        describe("createCollection and Mint", function () {
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
            })
            it("createCollection correctly", async function () {
                let collections = await mxcCollectionFactory.fetchCollections()
                let CryptoPunksAddr = collections[0].collection
                let AzukiAddr = collections[1].collection

                const nftContract = await ethers.getContractFactory(
                    "MXCCollection"
                )
                const CryptoPunks = await nftContract.attach(CryptoPunksAddr)
                const Azuki = await nftContract.attach(AzukiAddr)
                await CryptoPunks.mint(token1Uri)
                let totalSupply = await CryptoPunks.totalSupply()
                expect(totalSupply).to.equal(1)

                await Azuki.connect(addr1).mint(token2Uri)
                totalSupply = await Azuki.totalSupply()
                expect(totalSupply).to.equal(1)
            })
        })

        describe("delCollection", function () {
            beforeEach(async () => {
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "CryptoPunks",
                    "CryptoPunks",
                    5,
                    owner.address,
                    collect1Uri
                )
                await mxcCollectionFactory.createCollection(
                    marketplace.address,
                    "Azuki",
                    "Azuki",
                    10,
                    owner.address,
                    collect2Uri
                )
            })
            it("Only owner can do it", async function () {
                await expect(
                    mxcCollectionFactory
                        .connect(addr1)
                        .delCollection(collect2Uri)
                ).to.be.revertedWith("MXCCollectionFactory__NotOwner")
            })
            it("delCollection correctly", async function () {
                await mxcCollectionFactory.delCollection(collect2Uri)

                expect(
                    await mxcCollectionFactory.fetchCollectionsLength()
                ).to.equal(1)
            })

            it("event correctly", async function () {
                let collection =
                    await mxcCollectionFactory.callStatic.delCollection(
                        collect2Uri
                    )
                await expect(mxcCollectionFactory.delCollection(collect2Uri))
                    .to.emit(mxcCollectionFactory, "delCollectionEvent")
                    .withArgs(collection, owner.address)
            })
        })
    })
}
