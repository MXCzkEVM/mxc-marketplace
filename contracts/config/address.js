const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId

const contracts = {
    // wannsee
    5167003: {},
}

const tokens = {
    5167003: {},
}

const contractAttach = async (contractName, address) => {
    const contract = await ethers.getContractFactory(contractName)
    return await contract.attach(address)
}

const getDeployments = async (contract) => {
    const [deployer] = await ethers.getSigners()
    let { address, abi } = await deployments.get(contract)
    return new ethers.Contract(address, abi, deployer)
}

module.exports = {
    contracts: contracts[chainId],
    tokens: tokens[chainId],
    getDeployments,
    contractAttach,
}
