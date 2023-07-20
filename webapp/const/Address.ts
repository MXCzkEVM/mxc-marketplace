

import { ethers } from 'ethers'
import collectionFactory from "./abi_mxccollection/MXCCollectionFactoryV2.json"
import collection from "./abi_mxccollection/MXCCollectionV2Upgrade.json"
import marketplace from './abi_mxccollection/MXCMarketplaceUpgradeV3.json'
import mep1002 from './abi_mep/mep1002.json'
import mep1002Name from './abi_mep/mep1002Name.json'
import { provider } from './Network'

const CHAIN_ID = process.env.NEXT_PUBLIC_CHAINID || ""

const contracts: any = {
    18686: {
        COLLECTION_FACTORY: '0x50EA94513c502a5609c27Fb668a839C809316525',
        MARKETPLACE: '0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd',
        MEP1002NameStartBlock: 0
    },
    5167003: {
        COLLECTION_FACTORY: '0xD15A89C59A1aF63588B0b905dAD47eF20058998a',
        MARKETPLACE: '0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2',
        MEP1002Name: "0xad5a1855A383732f311241c1A4F9510da0Ad0743",
        MEP1002NameStartBlock: 61546
    },
    1337: {
        COLLECTION_FACTORY: '0x19249F90F1901134F233756C721F67Bc1Eb4164D',
        MARKETPLACE: '0x9dc0aeeF5685e7aAcA16f782eA5f3B2Dd0132a35',
        MEP1002NameStartBlock: 0
    },
    31337: {
        COLLECTION_FACTORY: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        MARKETPLACE: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        MEP1002NameStartBlock: 0
    }
}

export const ABI = {
    marketplace,
    collectionFactory,
    collection,
    mep1002,
    mep1002Name
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
