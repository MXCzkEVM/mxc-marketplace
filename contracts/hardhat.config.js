require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("hardhat-deploy")
require("@nomicfoundation/hardhat-chai-matchers")
require("hardhat-abi-exporter")
require("hardhat-contract-sizer")
require("hardhat-gas-reporter")
require("@openzeppelin/hardhat-upgrades")
// require("solidity-coverage")
// require("hardhat-storage-layout")
// require("@nomicfoundation/hardhat-toolbox")

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
    gasReporter: {
        enabled: true,
        // currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
        // coinmarketcap: COINMARKETCAP_API_KEY,
    },
    networks: {
        ganache: {
            chainId: 1337,
            url: "http://127.0.0.1:7545",
            gasPrice: 1000,
            saveDeployments: true,
            allowUnlimitedContractSize: true,
            gasLimit: 40000000,
        },
        hardhat: {
            chainId: 31337,
            gasPrice: 875000000,
            allowUnlimitedContractSize: true,
            saveDeployments: true,
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
            saveDeployments: true,
            allowUnlimitedContractSize: true,
            // gasPrice: 6000000000000,
        },
    },
    abiExporter: {
        path: "../mxc-marketplace/const/abi_mxccollection",
        runOnCompile: true,
        clear: true,
        flat: true,
        only: ["MXCCollectionFactory", "MXCCollectionV2", "MXCMarketPlace"],
        spacing: 2,
        // pretty: true,
        // format: "minimal",
    },
    contractSizer: {
        strict: true,
        unit: "B",
    },
    solidity: {
        compilers: [
            {
                version: "0.8.18",
            },
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999,
                    },
                },
            },
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 999999,
                    },
                },
            },
        ],
    },
}
