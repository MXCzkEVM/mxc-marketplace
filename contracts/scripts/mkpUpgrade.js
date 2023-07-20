const { ethers, getNamedAccounts, deployments, network } = require("hardhat")
const { networkConfig } = require("../helper-hardhat-config.js")
const { getDeployments, contractAttach, contracts } = require("./address.js")

const parseEther = ethers.utils.parseEther
const formatEther = ethers.utils.formatEther
const getBalance = ethers.provider.getBalance

const getExpire = () => {
    let date = new Date()
    date.setMonth(date.getMonth() + 6)
    let expiresAt = Math.floor(date.getTime() / 1000)
    return expiresAt
}

async function main() {
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    // await upgradeMarketPlace()
    await mkpV3Test()
}

async function mkpV3Test() {
    let marketplace = await contractAttach(
        "MXCMarketplaceUpgradeV3",
        contracts.mkp
    )

    // set nameToken
    // await marketplace.setNameToken(contracts.nameToken)

    // let nameToken = await marketplace.nameToken()
    // console.log(nameToken)

    // createOrder
    // await marketplace.createOrder(
    //     contracts.nameToken,
    //     ethers.BigNumber.from("0x0870134a4dffffff"),
    //     parseEther("100"),
    //     getExpire()
    // )

    // executeOrder
    let res = await marketplace.callStatic.executeNameOrder(
        ethers.BigNumber.from("0x0870134a4dffffff"),
        {
            value: parseEther("100"),
        }
    )
    console.log(res)
}

async function upgradeMarketPlace() {
    const mkpContractV1 = await ethers.getContractFactory(
        "MXCMarketplaceUpgrade"
    )
    const mkpContractV3 = await ethers.getContractFactory(
        "MXCMarketplaceUpgradeV3"
    )

    // let instance = mkpContractV1.attach(contracts.mkp)
    // let owner = await instance.admin()
    // console.log(owner)

    // get marketplace logic
    // const implement = await upgrades.erc1967.getImplementationAddress(
    //     contracts.mkp
    // )
    // console.log(implement)

    // upgrade
    // await upgrades.upgradeProxy(instance, mkpContractV3)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
