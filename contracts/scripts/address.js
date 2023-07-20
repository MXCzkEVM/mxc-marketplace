const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId

const contracts = {
    // wannsee
    5167003: {
        mkp: "0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2",
        nameToken: "0xad5a1855A383732f311241c1A4F9510da0Ad0743",
    },
    18686: {
        mkp: "0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd",
        yangcheng_nft: "0x7704870a55690599EB5ca47dA98076C3991469E5",
    },
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
    getDeployments,
    contractAttach,
}
