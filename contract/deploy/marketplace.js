const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const gasPrice = await ethers.provider.getGasPrice()
    // console.log(ethers.utils.formatEther(gasPrice))

    await deploy("MXCMarketplace", {
        from: deployer,
        args: [],
        log: true,
        gasPrice: gasPrice.mul(2),
    })
}

module.exports.tags = ["all", "marketplace"]
