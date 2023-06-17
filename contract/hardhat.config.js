require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")
// require("hardhat-gas-reporter")
// require("solidity-coverage")
// require("hardhat-storage-layout")
// require("@nomicfoundation/hardhat-toolbox")
require("@openzeppelin/hardhat-upgrades")

const PRIVATE_KEY_ADMIN = process.env.PRIVATE_KEY_ADMIN

module.exports = {
    defaultNetwork: "hardhat",
    namedAccounts: {
        deployer: {
            default: 0,
            167004: 0,
            5167003: 0,
            1337: 0,
        },
        user: {
            default: 1,
        },
    },
    networks: {
        ganache: {
            chainId: 1337,
            url: "HTTP://127.0.0.1:7545",
            gasPrice: 100,
        },
        hardhat: {
            chainId: 31337,
            gasPrice: 6000000000000,
        },
        arbiture_goerli: {
            url: "https://goerli-rollup.arbitrum.io/rpc",
            chainId: 421613,
            accounts: [PRIVATE_KEY_ADMIN],
            saveDeployments: true,
        },
        wannsee: {
            // url: "https://wannsee-rpc.mxc.com",
            url: "http://207.246.99.8:8545",
            chainId: 5167003,
            accounts: [PRIVATE_KEY_ADMIN],
            // gasPrice: 6000000000000,
            saveDeployments: true,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.18",
            },
            {
                version: "0.8.17",
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 99999,
                    },
                },
            },
        ],
    },
}
