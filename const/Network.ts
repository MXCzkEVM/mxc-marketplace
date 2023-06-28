

import collectionFactory from "./abi_mxccollection/MXCCollectionFactory.json"
import collection from "./abi_mxccollection/MXCCollectionV2.json"
import marketplace from './abi_mxccollection/MXCMarketplace.json'

const currentNetWork = 5167003
const networks = {
  5167003: {
    chainId: 5167003,
    rpc: ["https://wannsee-rpc.mxc.com"],
  },
  1337: {
    chainId: 1337,
    rpc: ["http://127.0.0.1:7545"]
  },
  31337: {
    chainId: 31337,
    rpc: ["http://127.0.0.1:8545"],
  },
}

const common = {
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
  }
}

const contracts = {
  5167003: {
    COLLECTION_FACTORY: '0x85e35a884774757B252B83EB1e33AbA625A8B71b',
    MARKETPLACE: '0x0BC56f298d40217f02c211Efe64D9B3a1Bf9ee6E'
  },
  1337: {
    COLLECTION_FACTORY: '0x19249F90F1901134F233756C721F67Bc1Eb4164D',
    MARKETPLACE: '0x9dc0aeeF5685e7aAcA16f782eA5f3B2Dd0132a35'
  },
  31337: {
    COLLECTION_FACTORY: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    MARKETPLACE: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'
  }
}

export const ABI = {
  marketplace,
  collectionFactory,
  collection
}

export const NETWORK = Object.assign(networks[currentNetWork], common)
export const CONTRACTS_MAP = contracts[currentNetWork]
export const ETHERSCAN_URL = "http://wannsee-explorer.mxc.com";
