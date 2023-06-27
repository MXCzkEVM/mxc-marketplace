const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { formatEther } = require("ethers/lib/utils")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()

    const chainId = network.config.chainId
    const config = networkConfig[chainId]

    // const gasPrice = await ethers.provider.getGasPrice()
    // console.log(formatEther(gasPrice))

    await deploy("MXCCollectionFactory", {
        from: deployer,
        args: [config.colectionAdmin],
        log: true,
    })
}

module.exports.tags = ["all", "collections"]
