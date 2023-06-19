const { assert, expect } = require("chai")
const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const { deployContracts } = require("../../utils/utils")
const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const tokenUri = "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo"

if (!developmentChains.includes(network.name)) {
    describe.skip
} else {
    describe("MXCCollection Unit Tests", function () {
        let owner, addr1, addr2, addrs, marketplace, mxcCollection
        beforeEach(async () => {
            ;[owner, addr1, addr2, ...addrs] = await ethers.getSigners()

            marketplace = await deployContracts("MXCMarketplace")
            mxcCollection = await deployContracts("MXCCollection", [
                owner.address,
                marketplace.address,
                addr1.address,
                10,
                "Alpha",
                "Alpha",
            ])
        })

        describe("Init correctly", function () {
            it("Should variable correctly", async function () {
                expect(await mxcCollection.creator()).to.equal(owner.address)
                expect(await mxcCollection.marketplaceContract()).to.equal(
                    marketplace.address
                )
                expect(await mxcCollection.royaltyRecipientAddress()).to.equal(
                    addr1.address
                )
                expect(await mxcCollection.royaltiesCutPerMillion()).to.equal(
                    10
                )
            })
        })

        describe("royaltyInfo", function () {
            it("Get back correct value", async function () {
                let { royaltyAmount, royaltyRecipient } =
                    await mxcCollection.royaltyInfo(parseEther("1"))

                expect(royaltyAmount).to.equal(
                    parseEther("1").mul(10).div(10000)
                )
                expect(royaltyRecipient).to.equal(addr1.address)
            })
        })

        describe("mint", function () {
            it("Only owner can mint", async function () {
                await expect(
                    mxcCollection.connect(addr1).mint(tokenUri)
                ).to.be.revertedWith("MXCCollection__NotCreator")
            })
            it("mint collect", async function () {
                await mxcCollection.mint(tokenUri)
                await mxcCollection.mint(tokenUri)

                let totalSupply = await mxcCollection.totalSupply()
                expect(totalSupply).to.equal(2)
                expect(await mxcCollection.tokenURI(0)).to.equal(tokenUri)
                expect(await mxcCollection.tokenURI(1)).to.equal(tokenUri)

                // maketplace should have authority
                expect(
                    await mxcCollection.isApprovedForAll(
                        owner.address,
                        marketplace.address
                    )
                ).to.equal(true)
            })
        })

        describe("burn", function () {
            beforeEach(async () => {
                await mxcCollection.mint(tokenUri)
                await mxcCollection.mint(tokenUri)
            })
            it("Only nft owner can burn", async function () {
                await expect(
                    mxcCollection.connect(addr1).burn(0)
                ).to.be.revertedWith("Caller is not owner nor approved")
            })
            it("burn collect", async function () {
                await mxcCollection.burn(0)
                let totalSupply = await mxcCollection.totalSupply()
                expect(totalSupply).to.equal(1)

                await expect(mxcCollection.tokenURI(0)).to.be.revertedWith(
                    "MXCCollection__NotExistToken"
                )
            })
        })
    })
}
