const { network, ethers, upgrades } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const MXCMarketplaceUpgradeFactory = await ethers.getContractFactory(
        "MXCMarketplaceUpgrade"
    )
    const marketPlaceProxy = await upgrades.deployProxy(
        MXCMarketplaceUpgradeFactory,
        [],
        {
            initializer: "initialize",
            kind: "uups",
        }
    )

    console.log(marketPlaceProxy.address, "marketPlaceProxy address")

    // const gasPrice = await ethers.provider.getGasPrice()
    // await deploy("MXCMarketplace", {
    //     from: deployer,
    //     args: [],
    //     log: true,
    //     gasPrice: gasPrice.mul(2),
    // })
}

module.exports.tags = ["all", "marketplace"]
