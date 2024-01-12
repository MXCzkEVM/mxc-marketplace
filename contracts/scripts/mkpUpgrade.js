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

    await upgradeMarketPlace()
    // await mkpV4Test()
}

async function mkpV4Test() {
    let marketplace = await contractAttach(
        "MXCMarketplaceUpgradeV4",
        contracts.mkp
    )

    const gasPrice = await ethers.provider.getGasPrice()
    // set nameToken
    // await marketplace.setNameToken(contracts.nameToken, {
    //     gasPrice: gasPrice.mul(5),
    //     nonce: 151,
    // })
    // set mnsToken
    // await marketplace.setDoaminToken(contracts.nameWrapper, {
    //     gasPrice: gasPrice.mul(5),
    //     nonce: 152,
    // })

    let nameToken = await marketplace.nameToken()
    console.log(nameToken)
    let domainToken = await marketplace.domainToken()
    console.log(domainToken)

    // createOrder - nameToken
    // await marketplace.callStatic.createOrder(
    //     contracts.nameToken,
    //     ethers.BigNumber.from("0x0870134a4dffffff"),
    //     parseEther("100"),
    //     getExpire()
    // )

    // createOrder - mns
    // await marketplace.callStatic.createOrder(
    //     contracts.nameWrapper,
    //     ethers.BigNumber.from(
    //         "0x0ae65b25be8177a9c2c63fed034d54cffe6096cdc7389943def9743f30c25716"
    //     ),
    //     parseEther("100"),
    //     getExpire()
    // )

    // executeOrder
    // let res = await marketplace.callStatic.executeNameOrder(
    //     ethers.BigNumber.from("0x0870134a4dffffff"),
    //     {
    //         value: parseEther("100"),
    //     }
    // )
    // console.log(res)
}

async function upgradeMarketPlace() {
    const mkpContractV1 = await ethers.getContractFactory(
        "MXCMarketplaceUpgrade"
    )
    const mkpContractV2 = await ethers.getContractFactory(
        "MXCMarketplaceUpgradeV2"
    )
    const mkpContractV3 = await ethers.getContractFactory(
        "MXCMarketplaceUpgradeV3"
    )
    const mkpContractV4 = await ethers.getContractFactory(
        "MXCMarketplaceUpgradeV4"
    )
    const mkpContractV5 = await ethers.getContractFactory(
        "MXCMarketPlaceUpgradeV5"
    )

    // console.log(contracts.mkp)
    // let instance = mkpContractV5.attach(contracts.mkp)
    // let owner = await instance.admin()
    // console.log(owner)

    // get marketplace logic
    // const implement = await upgrades.erc1967.getImplementationAddress(
    //     contracts.mkp
    // )
    // console.log(implement)

    // upgrade
    await upgrades.upgradeProxy(contracts.mkp, mkpContractV5)
    let res = await upgrades.prepareUpgrade(contracts.mkp, mkpContractV5)
    console.log(res)
    console.log(contracts.mkp)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
