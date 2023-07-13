

import collectionFactory from "./abi_mxccollection/MXCCollectionFactoryV2.json"
import collection from "./abi_mxccollection/MXCCollectionV2Upgrade.json"
import marketplace from './abi_mxccollection/MXCMarketplaceUpgrade.json'
import { ethers } from 'ethers'

export const CHAIN_ID = process.env.NEXT_PUBLIC_CHAINID || ""

const networks: any = {
  "5167003": {
    chainId: 5167003,
    rpc: ["https://wannsee-rpc.mxc.com"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "wannsee",
    slug: "wannsee",
    testnet: true,
    chain: "Wannsee",
    name: "Wannsee zkEVM Testnet",
    icon: {
      url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "http://wannsee-explorer.mxc.com"
  },
  "18686": {
    chainId: 18686,
    rpc: ["https://rpc.mxc.com"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "zkEVM Mainnet",
    slug: "zkEVM Mainnet",
    testnet: true,
    chain: "Wannsee",
    name: "zkEVM Mainnet",
    icon: {
      url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: "http://explorer.mxc.com"
  },
  "1337": {
    chainId: 1337,
    rpc: ["http://127.0.0.1:7545"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "wannsee",
    slug: "wannsee",
    testnet: true,
    chain: "Wannsee",
    name: "Wannsee zkEVM Testnet",
    icon: {
      url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: ""
  },
  "31337": {
    chainId: 31337,
    rpc: ["http://127.0.0.1:8545"],
    nativeCurrency: {
      decimals: 18,
      name: "MXC Token",
      symbol: "MXC",
    },
    shortName: "wannsee",
    slug: "wannsee",
    testnet: true,
    chain: "Wannsee",
    name: "Wannsee zkEVM Testnet",
    icon: {
      url: "https://wannsee-bridge.mxc.com/assets/mxc.d04bb8f6.png",
      height: 512,
      width: 512,
      format: 'png'
    },
    etherscan: ""
  },
}



const contracts: any = {
  18686: {
    COLLECTION_FACTORY: '0x50EA94513c502a5609c27Fb668a839C809316525',
    MARKETPLACE: '0xe031013A7B7Caf05FC20Bdc49B731E3F2f0cAfFd'
  },
  5167003: {
    COLLECTION_FACTORY: '0xD15A89C59A1aF63588B0b905dAD47eF20058998a',
    MARKETPLACE: '0x91fd2e13379dF87f752c82E8C16a1aE72601a9B2'
  },
  1337: {
    COLLECTION_FACTORY: '0x19249F90F1901134F233756C721F67Bc1Eb4164D',
    MARKETPLACE: '0x9dc0aeeF5685e7aAcA16f782eA5f3B2Dd0132a35'
  },
  31337: {
    COLLECTION_FACTORY: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MARKETPLACE: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'
  }
}



export const gatewayUrls = {
  "ipfs://": [
    "https://ipfs.thirdwebstorage.com/ipfs/",
    "https://ipfs.w3s.link",
    "https://gateway.ipfscdn.io/ipfs/",
    "https://cloudflare-ipfs.com/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://aqua-adverse-coyote-886.mypinata.cloud/ipfs/",
  ],
}

export const ABI = {
  marketplace,
  collectionFactory,
  collection
}

const provider = new ethers.providers.JsonRpcProvider(networks[CHAIN_ID].rpc[0]);

export const NETWORK = networks[CHAIN_ID]
export const CONTRACTS_MAP = contracts[CHAIN_ID]
export const ETHERSCAN_URL = NETWORK.etherscan


export const instanceCollectionFactory = async () => {
  return new ethers.Contract(CONTRACTS_MAP.COLLECTION_FACTORY, ABI.collectionFactory, provider)
}

export const instanceCollection = async (collection_id: string) => {
  return new ethers.Contract(collection_id, ABI.collection, provider)
}
