
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


export const NETWORK = networks[CHAIN_ID]
export const ETHERSCAN_URL = NETWORK.etherscan
export const provider = new ethers.providers.JsonRpcProvider(networks[CHAIN_ID].rpc[0]);

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




