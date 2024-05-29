

import { ethers } from 'ethers'
import collectionFactory from "./abi_mxccollection/MXCCollectionFactoryV5.json"
import collection from "./abi_mxccollection/MXCCollectionV5Upgrade.json"
import collectionv2 from "./abi_mxccollection/MXCCollectionV2Upgrade.json"
import marketplace from './abi_mxccollection/MXCMarketPlaceUpgradeV6.json'
import mep1002 from './abi_mep/mep1002.json'
import mep1004 from './abi_mep/mep1004.json'
import mep1002Name from './abi_mep/mep1002Name.json'
import mnsNameWrap from './abi_mns/NameWrapper.json'
import erc20 from './abi_common/erc20.json'
import { provider } from './Network'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAINID || ""

const contracts: any = {
    18686: {
        COLLECTION_FACTORY: '0x99c8905e91e92d7ba45056ca3d183f70a40b581d',
        MARKETPLACE: '0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd',
        XSD: "0x7d2016B09BF46A7CAABD3b45f9e1D6C485A2c729",

        MEP1004: "0x8Ff08F39B1F4Ad7dc42E6D63fd25AeE47EA801Ce",
        MEP1002Name: "0x7407459464741c17F8341D7EAFED5a4A5d9303b4",
        MEP1002NameStartBlock: 338,
        MNSNAMEWRAP: "0xD1B70f92b310c3Fa95b83dB436E00a53e1f1f5d5"
    },
    5167004: {
        COLLECTION_FACTORY: '0x270639e0D5Ec9F42d7000d26D309E445476897Ee',
        MARKETPLACE: '0xe596CC861D0406ce9a9Bd4bD9C4367469019D790',
        XSD: "0xB9506A80429Ee619C74D46a3276c622358795e2B",

        MEP1004: "0x0D589F5EeDF70e17F053CBb93760Db7E418603F6",
        MEP1002: "0x1964F08f56b79051fB3AE9a2C4d8D92A059b1237",
        MEP1002Name: "0xe5f46E29D91BeBa5C58a83f8558d912820FaC267",
        MEP1002NameStartBlock: 61546,
        MNSNAMEWRAP: "0xCE5e3c318BFC7c2dee486cF7c62Ba95feFd6d2bD"
    },
    1337: {
        COLLECTION_FACTORY: '0x19249F90F1901134F233756C721F67Bc1Eb4164D',
        MARKETPLACE: '0x9dc0aeeF5685e7aAcA16f782eA5f3B2Dd0132a35',
        MEP1002NameStartBlock: 0
    },
    31337: {
        COLLECTION_FACTORY: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        MARKETPLACE: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',

        MEP1002Name: "0x1964F08f56b79051fB3AE9a2C4d8D92A059b1237",
        MEP1002NameStartBlock: 61546,
        MNSNAMEWRAP: "0x2246EdAd0bc9212Bae82D43974619480A9D1f387"
    }
}

export const ABI = {
    marketplace,
    collectionFactory,
    collection,
    mep1004,
    mep1002,
    mep1002Name,
    mnsNameWrap,
    erc20,
    collectionv2
}


export const CONTRACTS_MAP = contracts[CHAIN_ID]

export const instanceCollectionFactory = async () => {
    return new ethers.Contract(CONTRACTS_MAP.COLLECTION_FACTORY, ABI.collectionFactory, provider)
}

export const instanceCollection = async (collection_id: string) => {
    return new ethers.Contract(collection_id, ABI.collection, provider)
}

export const instanceMep1002Name = async () => {
    return new ethers.Contract(CONTRACTS_MAP.MEP1002Name, ABI.mep1002Name, provider)
}

export const instanceNameWrapper = async () => {
    return new ethers.Contract(CONTRACTS_MAP.MNSNAMEWRAP, ABI.mnsNameWrap, provider)
}

export const launchpadAddresses = [
  
]