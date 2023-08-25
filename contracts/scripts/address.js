const { network, ethers, deployments } = require("hardhat")
const chainId = network.config.chainId || 31337

const contracts = {
    // wannsee
    5167003: {
        mkp: "0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2",
        nameToken: "0xad5a1855A383732f311241c1A4F9510da0Ad0743",
        nameWrapper: "0x2246EdAd0bc9212Bae82D43974619480A9D1f387",
    },
    18686: {
        mkp: "0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd",
        nameToken: "0x7407459464741c17F8341D7EAFED5a4A5d9303b4",
        nameWrapper: "0xD1B70f92b310c3Fa95b83dB436E00a53e1f1f5d5",
        // yangcheng_nft: "0x7704870a55690599EB5ca47dA98076C3991469E5",
    },
    31337: {
        mkp: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
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
