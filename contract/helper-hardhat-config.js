const developmentChains = ["hardhat", "localhost"]
const { ethers } = require("hardhat")

const networkConfig = {
    default: {
        name: "hardhat",
    },
    31337: {
        name: "localhost",
    },
    5: {
        name: "goerli",
    },
    421613: {
        name: "arbiture_goerli",
        c_mxcToken: "0x7Ab0Bd16f86Bc84A97387F204A962C9df79b420A",
    },
    5167003: {
        name: "wannsee",
        live: false,
        timeout: 120000000,
        // c_simpleStorage: `0x77E5a8bE0bb40212458A18dEC1A9752B04Cb6EA1`,
        // c_moonToken: `0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd`,
        // c_faucet: `0xEAA4b0e2e0CB6Ce39B547767cEd6711e704831E4`,
        // c_multCall: `0xD90bE8d98f56b8B6B1Cc22f42bc990290032bC49`,
        // c_mep1002: `0x8DD0d6b0238c26C14946095181A6C9671970B7cA`,
        // c_mep_name: `0x1D691e7B46c0c0295677171e1A71829fD1F71D1a`,
    },
    167004: {
        name: "taiko",
        // Bull: "0x6048e5ca54c021D39Cd33b63A44980132bcFA66d",
        // Horse: "0xCea5BFE9542eDf828Ebc2ed054CA688f0224796f",
        // c_simpleStorage: `0x6F17DbD2C10d11f650fE49448454Bf13dFA91641`,
        // c_moonToken: `0x6c3c72297C448A4BAa6Fc45552657Ad68378E3E1`,
        // c_faucet: `0x3c195C14D329C6B91Fd241d09a960d5A31eA8742`,
    },
    11155111: {
        name: "sepolia",
        Bull: "0x5B9fEDd37f0B92E7E282B19cEbCF06F57B77C604",
        Horse: "0x1E8C104D068F22D351859cdBfE41A697A98E6EA2",
    },
}

module.exports = {
    networkConfig,
    developmentChains,
}
