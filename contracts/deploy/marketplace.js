const { network, ethers, upgrades } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const MXCMarketplaceUpgradeFactory = await ethers.getContractFactory(
        "MXCMarketPlaceUpgradeV6"
    )
    const marketPlaceProxy = await upgrades.deployProxy(
      MXCMarketplaceUpgradeFactory, [],
      { initializer: "initialize", kind: "uups" }
    )
    console.log(MXCMarketplaceUpgradeFactory)
    console.log(marketPlaceProxy.address, "marketPlaceProxy address")
    // const gasPrice = await ethers.provider.getGasPrice()
    // await deploy("MXCMarketplace", {
    //    from: deployer,
    //    args: [],
    //    log: true,
    //    gasPrice: gasPrice.mul(2),
    // })
}

module.exports.tags = ["all", "marketplace"]
