const developmentChains = ["hardhat", "localhost"]
const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
        colectionAdmin: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    },
    5: {
        name: "goerli",
    },
    421613: {
        name: "arbiture_goerli",
    },
    5167003: {
        name: "wannsee",
        live: false,
        timeout: 120000000,
        colectionAdmin: "0x45A83F015D0265800CBC0dACe1c430E724D49cAc",
    },
    167004: {
        name: "taiko",
    },
    11155111: {
        name: "sepolia",
    },
}

module.exports = {
    networkConfig,
    developmentChains,
}
